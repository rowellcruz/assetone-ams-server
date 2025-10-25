import { useEffect, useRef, useState } from "react";
import { getVendors } from "../../services/vendorService";
import InfoModal from "../../components/InfoModal";
import {
  confirmSelectedVendor,
  getProcurementAttachments,
  getPurchaseRequestById,
  updatePurchaseRequest,
  uploadProcurementAttachment,
} from "../../services/purchaseRequestService";
import { getItems } from "../../services/itemService";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { formatDate } from "../../utils/formatDate";

const StepVendorSelection = ({ data, onNext, onBack }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const firstInputRef = useRef(null);
  const [purchaseRequest, setPurchaseRequest] = useState({});
  const [items, setItems] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [finalizedItems, setFinalizedItems] = useState([
    {
      brand: "",
      quantity: "",
      item_name: "",
      specifications: "",
      unit_price: "",
    },
  ]);
  const [mode, setMode] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    type: "",
    vendor_id: "",
    name: "",
    address: "",
    contact_phone: "",
    contact_email: "",
    contact_person: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const itemRes = await getItems();
        const prRes = await getPurchaseRequestById(id);
        const vendorRes = await getVendors();
        setItems(itemRes || []);
        setPurchaseRequest(prRes || []);
        setVendors(vendorRes || []);
      } catch (err) {
        console.error("Failed to fetch items:", err);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      fetchAttachments(data.id);
      if (data.vendor_id) {
        getVendors().then((list) => {
          const assignedVendor = list.find(
            (v) => v.id === String(data.vendor_id)
          );
          if (assignedVendor) {
            setSelectedVendor(assignedVendor);
            setFormData({
              type: "existing",
              vendor_id: assignedVendor.id,
              name: assignedVendor.name,
              address: assignedVendor.address,
              contact_phone: assignedVendor.contact_phone,
              contact_email: assignedVendor.contact_email,
              contact_person: assignedVendor.contact_person,
            });
            setMode("view");
          }
        });
      }

      setFinalizedItems(
        data.items && data.items.length > 0
          ? data.items.map((item) => ({
              brand: item.brand || "",
              item_name: item.item_name || "",
              specifications: item.specifications || "",
              quantity: item.quantity || "",
              unit_price: item.unit_price || "",
            }))
          : data.finalized_items && data.finalized_items.length > 0
          ? data.finalized_items
          : [
              {
                brand: "",
                quantity: "",
                item_name: "",
                specifications: "",
                unit_price: "",
              },
            ]
      );
    }
  }, [data]);

  const fetchAttachments = async (requestId) => {
    try {
      const existing = await getProcurementAttachments(requestId, {
        module: "approved_pof",
      });
      setAttachments(existing || []);
    } catch (err) {
      console.error("Failed to fetch attachments:", err);
      setError("Failed to load existing attachments");
    }
  };

  const isLocked = purchaseRequest?.items && purchaseRequest.items.length > 0;

  const handleUpload = async () => {
    if (!selectedFile || !purchaseRequest?.id) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      await uploadProcurementAttachment(
        purchaseRequest.id,
        formData,
        "approved_pof"
      );

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

  useEffect(() => {
    if (mode === "create") {
      setFormData((prev) => ({ ...prev, type: "new" }));
    } else if (mode === "select") {
      setFormData((prev) => ({ ...prev, type: "existing" }));
    }
  }, [mode]);

  const handleVendorSelect = (id) => {
    const vendor = vendors.find((v) => v.id === id);
    if (vendor) {
      setFormData({
        type: "existing",
        vendor_id: vendor.id,
        name: vendor.name,
        address: vendor.address,
        contact_phone: vendor.contact_phone,
        contact_email: vendor.contact_email,
        contact_person: vendor.contact_person,
      });
      setSelectedVendor(vendor);
      setMode("select");
    }
  };

  const handleClearVendor = () => {
    setSelectedVendor(null);
    setFormData({
      type: "",
      vendor_id: "",
      name: "",
      address: "",
      contact_phone: "",
      contact_email: "",
      contact_person: "",
    });
    setMode("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmVendor = async () => {
    if (
      !formData.type ||
      (formData.type !== "new" && formData.type !== "existing")
    ) {
      setError("Invalid vendor type. Please select or create a vendor first.");
      return;
    }

    try {
      await confirmSelectedVendor(id, { ...formData, finalizedItems });

      await updatePurchaseRequest(purchaseRequest.id, {
        status: "for_finalization",
        updated_by: user.id,
        updated_at: new Date(),
      });

      setMode("view");
      setFormData((prev) => ({
        ...prev,
        type: "existing",
        vendor_id: selectedVendor?.id || prev.vendor_id,
        name: selectedVendor?.name || prev.name,
        address: selectedVendor?.address || prev.address,
        contact_phone: selectedVendor?.contact_phone || prev.contact_phone,
        contact_email: selectedVendor?.contact_email || prev.contact_email,
        contact_person: selectedVendor?.contact_person || prev.contact_person,
      }));

      setPurchaseRequest((prev) => ({
        ...prev,
        status: "for_finalization",
      }));

      setMessage("Vendor selected successfully");
    } catch (error) {
      console.log(error);
      setError("Failed to select vendor");
    }
  };

  const handleChangeItem = (index, field, value) => {
    const updated = [...finalizedItems];
    updated[index][field] = value;
    setFinalizedItems(updated);
  };

  const handleAddRow = () => {
    setFinalizedItems([
      ...finalizedItems,
      {
        brand: "",
        quantity: "",
        item_name: "",
        specifications: "",
        unit_price: "",
      },
    ]);
  };

  const handleRemoveRow = (index) => {
    setFinalizedItems(finalizedItems.filter((_, i) => i !== index));
  };

  return (
    <div className="text-gray-700">
      <h2 className="text-lg font-semibold mb-3">Vendor Selection</h2>
      <p className="text-sm text-gray-500 mb-6">
        Create or select a vendor to assign to this procurement.
      </p>
      <div className="border p-6 rounded-xl bg-gray-50 mb-6">

        <h3 className="text-gray-800 font-semibold mb-3">Purchase Order</h3>
        <p className="text-sm text-gray-500 mb-4">
          Upload approved purchase order form.
        </p>

        <div className="flex items-center mb-4 space-x-3">
          <input
            id="fileInput"
            type="file"
            className="hidden"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
          <span className="flex-1 text-sm text-gray-700 truncate italic">
            {selectedFile?.name || "Please select file"}
          </span>
          <label
            htmlFor="fileInput"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium cursor-pointer hover:bg-blue-700"
          >
            {selectedFile ? "Change File" : "Select File"}
          </label>
          {selectedFile && (
            <button
              onClick={handleUpload}
              disabled={uploading}
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

        {attachments.length > 0 ? (
          <ul className="text-sm text-gray-700 space-y-2">
            {attachments.map((file) => (
              <li key={file.id} className="flex items-center justify-between">
                <a
                  href={`${import.meta.env.VITE_API_URL}/uploads/${
                    file.file_path || file.path
                  }`}
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

      {/* --- VENDOR SELECTION SECTION --- */}
      {!selectedVendor ? (
        <div className="border border-dashed rounded-xl bg-gray-50 p-6 mb-6 text-center cursor-pointer hover:bg-gray-100">
          <p className="text-sm text-gray-600 mb-3">
            Vendor Assignment Section
          </p>
          {!mode && (
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setMode("create")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + Create Vendor
              </button>
              <button
                onClick={() => setMode("select")}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                + Select Vendor
              </button>
            </div>
          )}

          {mode === "select" && (
            <div className="mt-4 space-y-4">
              <label className="block text-sm font-medium text-gray-600">
                Select Existing Vendor
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
                onChange={(e) => handleVendorSelect(e.target.value)}
                defaultValue=""
              >
                <option value="">-- Choose Vendor --</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {mode === "create" && (
            <div className="relative border p-6 rounded-xl bg-white shadow-sm mb-6">
              <button
                onClick={() => setMode("")}
                className="absolute top-3 right-3 text-black hover:text-gray-600"
              >
                ✕
              </button>

              <h3 className="text-gray-800 font-semibold text-base mb-4">
                Create New Vendor
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "name",
                  "address",
                  "contact_phone",
                  "contact_email",
                  "contact_person",
                ].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-600 capitalize mb-1">
                      {field.replace("_", " ")}
                    </label>
                    <input
                      type="text"
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
                      placeholder={`Enter ${field.replace("_", " ")}`}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    if (formData.name) setSelectedVendor(formData);
                  }}
                  className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Confirm Vendor
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="relative border p-6 rounded-xl bg-white shadow-sm mb-6">
          {mode !== "view" && (
            <button
              onClick={handleClearVendor}
              className="absolute top-3 right-3 text-black hover:text-gray-600"
            >
              ✕
            </button>
          )}
          <h3 className="font-semibold text-gray-800 text-lg mb-4">
            {mode === "view"
              ? "Assigned Vendor"
              : mode === "create"
              ? "New Vendor Details"
              : "Selected Vendor"}
          </h3>

          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Company Name</p>
              <p className="font-medium text-gray-800">{formData.name}</p>
            </div>
            <div>
              <p className="text-gray-500">Address</p>
              <p className="font-medium text-gray-800">{formData.address}</p>
            </div>
            <div>
              <p className="text-gray-500">Phone Number</p>
              <p className="font-medium text-gray-800">
                {formData.contact_phone}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Email Address</p>
              <p className="font-medium text-gray-800">
                {formData.contact_email}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Contact Person</p>
              <p className="font-medium text-gray-800">
                {formData.contact_person}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Finalization Table with Inputs */}
      <div className="space-y-2 mt-8 mb-6">
        <label className="text-sm font-medium text-gray-600">
          Finalized Purchase Order Details
        </label>

        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th className="border border-gray-400 px-3 py-2 text-left font-medium">
                Brand
              </th>
              <th className="border border-gray-400 px-3 py-2 text-left font-medium">
                Product/Asset
              </th>
              <th className="border border-gray-400 px-3 py-2 text-left font-medium">
                Specifications
              </th>
              <th className="border border-gray-400 px-3 py-2 w-24 text-left font-medium">
                Quantity
              </th>
              <th className="border border-gray-400 px-3 py-2 w-48 text-left font-medium">
                Unit Price
              </th>
              <th className="border border-gray-400 px-3 py-2 w-48 text-left font-medium">
                Total Amount
              </th>

              <th className="border border-gray-400 px-3 py-2 w-16"></th>
            </tr>
          </thead>
          <tbody>
            {finalizedItems.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-400 align-top">
                  <textarea
                    value={item.brand || ""}
                    onChange={(e) =>
                      handleChangeItem(index, "brand", e.target.value)
                    }
                    disabled={isLocked}
                    className="w-full px-2 py-1 focus:outline-none focus:ring-0 resize-none min-h-[60px] bg-white"
                    placeholder="Enter product brand"
                    ref={index === 0 ? firstInputRef : null}
                  />
                </td>
                <td className="border border-gray-400 align-top">
                  <input
                    list="itemList"
                    type="text"
                    value={item.item_name}
                    onChange={(e) =>
                      handleChangeItem(index, "item_name", e.target.value)
                    }
                    disabled={isLocked}
                    className="w-full px-2 py-1 focus:outline-none focus:ring-0 resize-none min-h-[60px] bg-white"
                    placeholder="Enter or select asset name"
                  />
                  {/* Datalist for autocomplete */}
                  <datalist id="itemList">
                    {items.map((a) => (
                      <option key={a.id} value={a.name} />
                    ))}
                  </datalist>
                </td>
                <td className="border border-gray-400 align-top">
                  <textarea
                    value={item.specifications || ""}
                    onChange={(e) =>
                      handleChangeItem(index, "specifications", e.target.value)
                    }
                    disabled={isLocked}
                    className="w-full px-2 py-1 focus:outline-none focus:ring-0 resize-none min-h-[60px] bg-white"
                    placeholder="e.g., RAM: 32GB"
                  />
                </td>
                <td className="border border-gray-400 text-center align-top">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleChangeItem(index, "quantity", e.target.value)
                    }
                    disabled={isLocked}
                    className="w-full px-2 py-1 focus:outline-none focus:ring-0 resize-none min-h-[60px] bg-white"
                    placeholder=""
                  />
                </td>
                <td className="border border-gray-400 align-top">
                  <input
                    type="number"
                    value={item.unit_price}
                    onChange={(e) =>
                      handleChangeItem(index, "unit_price", e.target.value)
                    }
                    disabled={isLocked}
                    className="w-full px-2 py-1 focus:outline-none focus:ring-0 resize-none min-h-[60px] bg-white"
                    placeholder=""
                  />
                </td>
                <td className="border border-gray-400 align-top">
                  <input
                    type="number"
                    value={(item.quantity || 0) * (item.unit_price || 0)}
                    readOnly
                    className="w-full px-2 py-1 focus:outline-none focus:ring-0 bg-bg-white text-right"
                    placeholder=""
                  />
                </td>
                <td className="border border-gray-400 text-center align-top">
                  {!isLocked && finalizedItems.length > 1 && (
                    <button
                      onClick={() => handleRemoveRow(index)}
                      className="text-red-500 hover:underline text-xs"
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!isLocked && (
          <button
            type="button"
            onClick={handleAddRow}
            className="text-blue-600 hover:underline text-sm mt-2"
          >
            + Add Row
          </button>
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
        >
          Back
        </button>

        {mode === "view" ? (
          <button
            onClick={onNext}
            disabled={attachments.length <= 0 || uploading || !selectedVendor}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleConfirmVendor}
            disabled={attachments.length <= 0 || uploading || !selectedVendor}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Vendor
          </button>
        )}
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

export default StepVendorSelection;
