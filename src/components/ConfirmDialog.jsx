export default function ConfirmDialog({
  open,
  title = 'Confirmar ação',
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        aria-label="Fechar"
        className="absolute inset-0 bg-black/30"
        onClick={onCancel}
      />
      <div className="relative bg-white border rounded-xl shadow-lg w-full max-w-sm p-5">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-sm rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-3 py-1.5 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? 'Excluindo...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}