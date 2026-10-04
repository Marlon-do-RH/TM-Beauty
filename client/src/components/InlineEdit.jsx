import { useRef } from 'react'
import { IconCamera, IconPlus, IconTrash } from './AdminIcons'
import styles from './InlineEdit.module.css'

export function HiddenFileButton({ onFile, className, title, children, disabled }) {
  const ref = useRef()
  return (
    <>
      <button
        type="button"
        className={className}
        title={title}
        disabled={disabled}
        onClick={() => ref.current?.click()}
      >
        {children}
      </button>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className={styles.fileInput}
        onChange={e => {
          const file = e.target.files?.[0]
          e.target.value = ''
          if (file) onFile(file)
        }}
      />
    </>
  )
}

export function EditOverlay({ children }) {
  return <div className={styles.overlay}>{children}</div>
}

export function EditBtn({ title, onClick, danger, children, disabled }) {
  return (
    <button
      type="button"
      className={`${styles.btn} ${danger ? styles.danger : ''}`}
      title={title}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export function ReplaceBtn({ onFile, disabled, title = 'Replace photo' }) {
  return (
    <HiddenFileButton onFile={onFile} className={styles.btn} title={title} disabled={disabled}>
      <IconCamera size={13} />
    </HiddenFileButton>
  )
}

export function AddBtn({ onFile, disabled, title = 'Add photo' }) {
  return (
    <HiddenFileButton onFile={onFile} className={styles.btn} title={title} disabled={disabled}>
      <IconPlus size={13} />
    </HiddenFileButton>
  )
}

export function DeleteBtn({ onClick, disabled, title = 'Remove photo' }) {
  return (
    <EditBtn title={title} onClick={onClick} danger disabled={disabled}>
      <IconTrash size={13} />
    </EditBtn>
  )
}
