import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getProcurementAttachments,
  updatePurchaseRequest,
  uploadProcurementAttachment,
} from "../../services/purchaseRequestService";
import InfoModal from "../../components/InfoModal";
import { formatDate } from "../../utils/formatDate";

const StepValidationApproval = ({ data, onNext, onBack }) => {
  const { user } = useAuth();
  const [purchaseRequest, setPurchaseRequest] = useState({});
  const [attachments, setAttachments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (data) {
      setPurchaseRequest(data);
      fetchAttachments(data.id);
    }
  }, [data]);

  const fetchAttachments = async (requestId) => {
    try {
      const existing = await getProcurementAttachments(requestId, {module: "approved_prf"});
      setAttachments(existing || []);
      console.log(existing);
    } catch (err) {
      console.error("Failed to fetch attachments:", err);
      setError("Failed to load existing attachments");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !purchaseRequest?.id) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      await uploadProcurementAttachment(
        purchaseRequest.id,
        formData,
        "approved_prf"
      );

      await updatePurchaseRequest(purchaseRequest.id, {
        status: "processing",
        updated_by: user.id,
        updated_at: new Date(),
      });

      await fetchAttachments(purchaseRequest.id);

      setSelectedFile(null);
      setMessage("Purchase requisition form uploaded successfully.");
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="text-gray-700">
      <h2 className="text-lg font-semibold mb-3">Validation & Approval</h2>
      <p className="text-sm text-gray-500 mb-6">
        Upload approved purchase requisition form.
      </p>

      <div className="border p-6 rounded-xl bg-gray-50 mb-6">
        <p className="text-sm text-gray-600 mb-2">
          Approved purchase requisition form
        </p>

        {/* Attachment upload (always active) */}
        <div className="flex items-center mb-4 space-x-3">
          <input
            id="fileInput"
            type="file"
            className="hidden"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />

          {/* Display selected file name */}
          <span className="flex-1 text-sm text-gray-700 truncate max-w-s italic">
            {selectedFile?.name || "Please select file"}
          </span>

          {/* Visible select file button */}
          <label
            htmlFor="fileInput"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium cursor-pointer hover:bg-blue-700"
          >
            {selectedFile ? "Change File" : "Select File"}
          </label>

          {/* Upload button */}
          {selectedFile && (
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {uploading
                ? "Uploading..."
                : attachments.length > 0
                ? "Resubmit File"
                : "Upload File"}
            </button>
          )}
        </div>

        {/* Existing attachments list */}
        {attachments.length > 0 ? (
          <ul className="text-sm text-gray-700 space-y-2">
            {attachments.map((file) => (
              <li key={file.id} className="flex items-center justify-between">
                <a
                  href={`${import.meta.env.VITE_API_URL}/uploads/${file.file_path || file.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate max-w-xs"
                >
                  {file.original_name ||
                    file.filename ||
                    file.file_name ||
                    "Attachment"}
                </a>
                <span className="text-gray-400 text-xs">
                  {formatDate(file.uploaded_at)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400 italic">
            No attachments uploaded yet.
          </p>
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={attachments.length === 0}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Proceed to Vendor Selection
        </button>
      </div>

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

export default StepValidationApproval;
