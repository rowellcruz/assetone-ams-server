import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InfoModal from "../../components/InfoModal";
import { getSubLocationDataById } from "../../services/locationService";
import {
  submitRequest,
} from "../../services/itemRequestService";
import { getPublicAssets } from "../../services/procurementRequestService";

const ProcurementReportPage = () => {
  const { id } = useParams();
  const [location, setLocation] = useState({});
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState("1");
  const [impact, setImpact] = useState("1");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const locationData = await getSubLocationDataById(id);
        const assetData = await getPublicAssets();
        setLocation(locationData);
        setAssets(assetData);
      } catch (err) {
        console.error("Failed to fetch asset:", err);
      }
    };

    fetchAsset();
  }, [id]);

  const handleRequestAsset = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      request_type: "asset",
      sub_location_id: location.id,
      asset_id: selectedAsset,
      requester_email: email,
      description,
      impact,
      urgency,
    };

    try {
      await submitRequest(payload);
      setMessage("Request sumbitted successfully. Please wait for approval.");
      setSelectedAsset("");
      setEmail("");
      setDescription("");
      setImpact(1);
      setUrgency(1);
    } catch (error) {
      setError(
        error.response?.data?.message || "Submission failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleRequestAsset}
      className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
    >
      <h2 className="text-2xl font-bold mb-4">
        <span>Request Asset for</span>
        <br />
        <span>
          {location.location_name} - {location.name}
        </span>
      </h2>

      {/* Asset selection */}
      <div className="space-y-1 mb-3">
        <label className="text-sm font-medium text-gray-600">Asset</label>
        <select
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          value={selectedAsset}
          onChange={(e) => setSelectedAsset(e.target.value)}
          required
        >
          <option value="">Select an asset</option>
          {assets.map((asset) => (
            <option key={asset.id} value={asset.id}>
              {asset.type}
            </option>
          ))}
        </select>
      </div>

      {/* Issue description */}
      <div className="space-y-1 mb-3">
        <label className="text-sm font-medium text-gray-600">Request</label>
        <textarea
          placeholder="Describe your request"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          required
        />
      </div>

      {/* Impact */}
      <div className="space-y-1 mb-3">
        <label className="text-sm font-medium text-gray-600">{`Impact (who is affected)`}</label>
        <select
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          value={impact}
          onChange={(e) => setImpact(e.target.value)}
        >
          <option value="1">Only me</option>
          <option value="2">A few people</option>
          <option value="3">A whole department</option>
          <option value="4">The whole campus</option>
        </select>
      </div>

      {/* Urgency */}
      <div className="space-y-1 mb-3">
        <label className="text-sm font-medium text-gray-600">{`Urgency (how fast it’s needed)`}</label>
        <select
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          value={urgency}
          onChange={(e) => setUrgency(e.target.value)}
        >
          <option value="1">Whenever possible</option>
          <option value="2">Soon</option>
          <option value="3">As soon as possible</option>
          <option value="4">Right now</option>
        </select>
      </div>

      {/* Email */}
      <div className="space-y-1 mb-3">
        <label className="text-sm font-medium text-gray-600">Email</label>
        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full text-white p-2 rounded ${
          isSubmitting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gray-600 hover:bg-gray-700"
        }`}
      >
        {isSubmitting ? "Submitting..." : "Submit Report"}
      </button>

      <InfoModal
        error={error}
        message={message}
        clearMessages={() => {
          setError("");
          setMessage("");
        }}
      />
    </form>
  );
};

export default ProcurementReportPage;
