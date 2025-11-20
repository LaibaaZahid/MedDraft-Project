export default function ResultsList({ results }) {
  if (!results || results.length === 0) return null;

  return (
    <div className="p-4 shadow space-y-4 rounded w-full text-white bg-gray-600/90">
      

      {results.map((item, index) => (
        <div key={index} className="space-y-2">
          
          <div className="border p-2 rounded">
            <p className="font-medium text-white">Model: {item.model}</p>
            <pre className="whitespace-pre-wrap text-white">{item.soapNote}</pre>
          </div>

          <button
            onClick={() => {
              const blob = new Blob([item.soapNote], { type: "text/plain" });
              const link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              link.download = `${item.model}_SOAP_Note.txt`;
              link.click();
            }}
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
          >
            Download SOAP Note
          </button>

        </div>
      ))}
    </div>
  );
}
