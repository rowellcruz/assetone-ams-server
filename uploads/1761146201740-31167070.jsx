import { useEffect, useState } from "react";
import { Calendar, Tag, ClipboardList, User, Clock } from "lucide-react";
import { formatDate } from "../../utils/formatDate";
import InfoModal from "../../components/InfoModal";
import { useAuth } from "../../context/AuthContext";
import { updatePurchaseRequest } from "../../services/purchaseRequestService";

const StepPurchaseRequestDetails = ({ data, onNext }) => {
  const { user } = useAuth();
  const [purchaseRequest, setPurchaseRequest] = useState({});
  const [remarks, setRemarks] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    if (data) setPurchaseRequest(data);
  }, [data]);

  const handleRework = async () => {
    if (!purchaseRequest) return;
    try {
      await updatePurchaseRequest(purchaseRequest.id, {
        status: "rework",
        remarks,
        reviewed_by: user.id,
        reviewed_at: new Date(),
        updated_by: user.id,
        updated_at: new Date(),
      });
      setPurchaseRequest({...purchaseRequest, status: "rework"});
      setMessage("Purchase request sent for rework");
    } catch (error) {
      console.error(error);
      setError("Failed to rework request");
    } finally {
      setShowReviewModal(false);
      setRemarks("");
    }
  };

  return (
    <div className="text-gray-700">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Purchase Request Details</h2>
        <button
          className="px-4 py-2 text-sm bg-green-100 hover:bg-green-200 text-gray-700 rounded-lg font-medium transition"
          onClick={() => {
            /* open modal or navigate to form here */
          }}
        >
          View Purchase Acquisition Form
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        Review and verify the purchase request information before approval.
      </p>

      <div className="grid md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Control Number
            </h3>
            <p className="text-base font-semibold text-gray-800">
              {purchaseRequest.control_number || "—"}
            </p>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Tag size={18} />
            <div>
              <p className="text-sm font-medium text-gray-800">
                {purchaseRequest.item_category_name || "—"}
              </p>
              <p className="text-xs text-gray-500">Category</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <User size={18} />
            <div>
              <p className="text-sm font-medium text-gray-800">
                {purchaseRequest.requestor}
              </p>
              <p className="text-xs text-gray-500">Requested By </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={18} />
            <div>
              <p className="text-sm font-medium text-gray-800">
                {formatDate(purchaseRequest.date_required)}
              </p>
              <p className="text-xs text-gray-500">Date Required</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Clock size={18} />
            <div>
              <p className="text-sm font-medium text-gray-800">
                {formatDate(purchaseRequest.requested_at)}
              </p>
              <p className="text-xs text-gray-500">Requested At</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <ClipboardList size={18} />
            <div>
              <p className="text-sm font-medium text-gray-800 capitalize">
                {purchaseRequest.department_name}
              </p>
              <p className="text-xs text-gray-500">From</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-600 mb-1">Reason</h3>
        <p className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm text-gray-700">
          {purchaseRequest.reason || "No reason provided."}
        </p>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-600 mb-2">
          Requested Items
        </h3>

        {Array.isArray(purchaseRequest.requested_items) &&
        purchaseRequest.requested_items.length > 0 ? (
          <div className="overflow-x-auto border border-gray-100 rounded-lg">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-4 py-2 text-left w-20">Qty</th>
                  <th className="px-4 py-2 text-left">
                    Item Description / Specifications
                  </th>
                </tr>
              </thead>
              <tbody>
                {purchaseRequest.requested_items.map((item, index) => (
                  <tr
                    key={index}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-2 font-medium text-gray-800">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-2">{item.item_description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500 bg-gray-50 border border-gray-100 rounded-lg p-3">
            No requested items listed.
          </p>
        )}
      </div>

      <div className="mt-8 flex justify-end gap-3">
        {purchaseRequest.status === "rework" ? (
          <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg font-medium">
            <Clock className="w-4 h-4" />
            Waiting for Rework
          </span>
        ) : purchaseRequest.status === "pending" ? (
          <>
            <button
              onClick={() => setShowReviewModal(true)}
              className="px-5 py-2.5 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200"
            >
              Rework
            </button>
            <button
              onClick={onNext}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Approve
            </button>
          </>
        ) : (
          <button
            onClick={onNext}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            Next
          </button>
        )}
      </div>

      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              Review Purchase Request
            </h2>
            <textarea
              className="w-full border border-gray-300 rounded-md p-2 mb-4 resize-none"
              placeholder="Enter remarks..."
              value={remarks}
              rows={5}
              onChange={(e) => setRemarks(e.target.value)}
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setRemarks("");
                }}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleRework}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
              >
                Rework
              </button>
            </div>
          </div>
        </div>
      )}

      <InfoModal
        message={message}
        error={error}
        clearMessages={() => {
          setMessage("");
          setError("");
        }}
      />
    </div>
  );
};

export default StepPurchaseRequestDetails;
