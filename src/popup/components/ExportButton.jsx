export default function ExportButton({ data }) {
  const handleExport = (format) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = format === 'json' ? 'odoo_data.json' : 'odoo_data.csv';
    a.click();
  };

  return (
    <div className="flex gap-1">
      <button
        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded transition-colors duration-200"
        onClick={() => handleExport('json')}
      >
        Export JSON
      </button>
      <button
        className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded transition-colors duration-200"
        onClick={() => handleExport('csv')}
      >
        Export CSV
      </button>
    </div>
  );
}
