import { Modal } from './Modal.tsx'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message }: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-stone-300 mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-stone-700 hover:bg-stone-600 text-stone-300"
        >
          Cancel
        </button>
        <button
          onClick={() => { onConfirm(); onClose() }}
          className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-600 text-white"
        >
          Delete
        </button>
      </div>
    </Modal>
  )
}
