function ConfirmModal({ mensaje, onAceptar, onCancelar }) {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '16px',
        padding: '32px 28px',
        width: '320px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: '16px',
          color: '#333',
          marginBottom: '28px',
          lineHeight: '1.5'
        }}>
          {mensaje}
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={onCancelar}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: '2px solid #7C3AED',
              backgroundColor: 'transparent',
              color: '#7C3AED',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onAceptar}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#7C3AED',
              color: '#fff',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal