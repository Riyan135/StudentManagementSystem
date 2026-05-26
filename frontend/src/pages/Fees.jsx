import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CreditCard, CheckCircle, Clock, Download, AlertCircle } from 'lucide-react';

const Fees = () => {
  const { user, token, API_URL, addNotification } = useAuth();
  const [fees, setFees] = useState([]);
  const [showPayModal, setShowPayModal] = useState(false);
  const [activeFee, setActiveFee] = useState(null);
  const [showReceipt, setShowReceipt] = useState(null);

  // Payment form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const res = await fetch(`${API_URL}/fees`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFees(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!activeFee) return;
    setPaying(true);

    // Simulate 2 second payment processing
    await new Promise(r => setTimeout(r, 2000));

    try {
      const res = await fetch(`${API_URL}/fees/${activeFee._id}/pay`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        addNotification('Payment Successful', `Fee "${activeFee.title}" has been paid successfully!`, 'success');
        setShowPayModal(false);
        setCardNumber('');
        setCardName('');
        setExpiry('');
        setCvv('');
        // Refresh fees list
        fetchFees();
      } else {
        alert('Payment failed, please try again');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPaying(false);
    }
  };

  const totalPending = fees.filter(f => f.status === 'Pending').reduce((acc, f) => acc + f.amount, 0);
  const totalPaid = fees.filter(f => f.status === 'Paid').reduce((acc, f) => acc + f.amount, 0);

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Summary Cards */}
      <div className="dashboard-grid">
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ padding: '16px', background: 'rgba(239,68,68,0.08)', borderRadius: '12px', color: 'var(--danger)' }}>
            <AlertCircle size={28} />
          </div>
          <div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Total Pending</p>
            <h3 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--danger)' }}>₹{totalPending.toLocaleString()}</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ padding: '16px', background: 'rgba(16,185,129,0.08)', borderRadius: '12px', color: 'var(--success)' }}>
            <CheckCircle size={28} />
          </div>
          <div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Total Paid</p>
            <h3 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--success)' }}>₹{totalPaid.toLocaleString()}</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ padding: '16px', background: 'rgba(37,99,235,0.08)', borderRadius: '12px', color: 'var(--primary-color)' }}>
            <CreditCard size={28} />
          </div>
          <div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Total Records</p>
            <h3 style={{ fontSize: '24px', fontWeight: '800' }}>{fees.length}</h3>
          </div>
        </div>
      </div>

      {/* Fees Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>Fee Payment Ledger</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.05)', color: 'var(--text-secondary)', fontSize: '13px' }}>
                <th style={{ padding: '12px' }}>Fee Head</th>
                <th style={{ padding: '12px' }}>Amount</th>
                <th style={{ padding: '12px' }}>Due Date</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px' }}>Transaction ID</th>
                <th style={{ padding: '12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fees.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-light)' }}>
                    No fee records found.
                  </td>
                </tr>
              ) : (
                fees.map(fee => (
                  <tr key={fee._id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', fontSize: '14px' }}>
                    <td style={{ padding: '16px', fontWeight: '600' }}>{fee.title}</td>
                    <td style={{ padding: '16px', fontWeight: '700', color: fee.status === 'Paid' ? 'var(--success)' : 'var(--danger)' }}>
                      ₹{fee.amount.toLocaleString()}
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>
                      {new Date(fee.dueDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        background: fee.status === 'Paid' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                        color: fee.status === 'Paid' ? 'var(--success)' : 'var(--danger)',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontWeight: '700',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        width: 'fit-content'
                      }}>
                        {fee.status === 'Paid' ? <CheckCircle size={12} /> : <Clock size={12} />}
                        {fee.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-light)', fontSize: '12px' }}>
                      {fee.transactionId || '—'}
                    </td>
                    <td style={{ padding: '16px' }}>
                      {fee.status === 'Pending' ? (
                        <button
                          onClick={() => {
                            setActiveFee(fee);
                            setShowPayModal(true);
                          }}
                          className="btn-primary"
                          style={{ padding: '8px 16px', fontSize: '13px' }}
                        >
                          Pay Now
                        </button>
                      ) : (
                        <button
                          onClick={() => setShowReceipt(fee)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            border: '1px solid rgba(16,185,129,0.2)',
                            background: 'rgba(16,185,129,0.06)',
                            color: 'var(--success)',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: '600'
                          }}
                        >
                          <Download size={14} /> Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayModal && activeFee && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
        }}>
          <div className="glass-panel fade-in" style={{ background: 'white', padding: '36px', width: '460px', maxWidth: '90%', borderRadius: '20px' }}>

            {/* Receipt Header */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ background: 'var(--primary-gradient)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                <CreditCard size={22} color="white" />
              </div>
              <h3 style={{ fontSize: '20px' }}>Secure Fee Payment</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
                {activeFee.title} — <strong>₹{activeFee.amount.toLocaleString()}</strong>
              </p>
            </div>

            <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Visual Card */}
              <div style={{
                background: 'var(--primary-gradient)',
                borderRadius: '16px',
                padding: '24px',
                color: 'white',
                marginBottom: '8px',
                boxShadow: '0 8px 20px rgba(37,99,235,0.25)'
              }}>
                <p style={{ fontSize: '11px', opacity: 0.7, marginBottom: '12px', letterSpacing: '2px' }}>CARD NUMBER</p>
                <p style={{ fontSize: '20px', letterSpacing: '4px', fontFamily: 'monospace', marginBottom: '20px' }}>
                  {cardNumber ? cardNumber.replace(/(\d{4})/g, '$1 ').trim() : '**** **** **** ****'}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '10px', opacity: 0.7, marginBottom: '2px' }}>CARD HOLDER</p>
                    <p style={{ fontSize: '14px', fontWeight: '600' }}>{cardName || 'Your Name'}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '10px', opacity: 0.7, marginBottom: '2px' }}>EXPIRY</p>
                    <p style={{ fontSize: '14px', fontWeight: '600' }}>{expiry || 'MM/YY'}</p>
                  </div>
                </div>
              </div>

              <input
                type="text"
                placeholder="Card Number (16 digits)"
                maxLength={16}
                required
                value={cardNumber}
                onChange={e => setCardNumber(e.target.value.replace(/\D/g, ''))}
                className="glass-input"
              />
              <input
                type="text"
                placeholder="Card Holder Name"
                required
                value={cardName}
                onChange={e => setCardName(e.target.value)}
                className="glass-input"
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="MM/YY Expiry"
                  maxLength={5}
                  required
                  value={expiry}
                  onChange={e => setExpiry(e.target.value)}
                  className="glass-input"
                />
                <input
                  type="password"
                  placeholder="CVV"
                  maxLength={3}
                  required
                  value={cvv}
                  onChange={e => setCvv(e.target.value.replace(/\D/g, ''))}
                  className="glass-input"
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1, padding: '14px', position: 'relative', overflow: 'hidden' }}
                  disabled={paying}
                >
                  {paying ? '⏳ Processing...' : `Pay ₹${activeFee.amount.toLocaleString()}`}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  disabled={paying}
                  style={{ flex: 1, padding: '14px', border: '1px solid rgba(0,0,0,0.1)', background: 'none', cursor: 'pointer', borderRadius: '8px', fontWeight: '600' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Viewer Modal */}
      {showReceipt && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
        }}>
          <div className="glass-panel fade-in" id="receipt-content" style={{ background: 'white', padding: '36px', width: '420px', maxWidth: '90%', borderRadius: '20px' }}>
            <div style={{ textAlign: 'center', borderBottom: '2px dashed rgba(0,0,0,0.08)', paddingBottom: '20px', marginBottom: '20px' }}>
              <div style={{ background: 'var(--primary-gradient)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px auto' }}>
                <CheckCircle size={22} color="white" />
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: '800' }}>Payment Receipt</h3>
              <p style={{ color: 'var(--success)', fontWeight: '600', fontSize: '13px', marginTop: '4px' }}>✅ Transaction Successful</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              {[
                { label: 'Fee Title', value: showReceipt.title },
                { label: 'Amount Paid', value: `₹${showReceipt.amount.toLocaleString()}` },
                { label: 'Payment Date', value: showReceipt.paidDate ? new Date(showReceipt.paidDate).toLocaleDateString() : '—' },
                { label: 'Transaction ID', value: showReceipt.transactionId || '—' },
                { label: 'Receipt No.', value: showReceipt.receiptNumber || '—' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                  <span style={{ fontWeight: '700' }}>{item.value}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={() => window.print()}
                className="btn-primary"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Download size={16} /> Download Receipt
              </button>
              <button
                onClick={() => setShowReceipt(null)}
                style={{ flex: 1, padding: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'none', cursor: 'pointer', borderRadius: '8px', fontWeight: '600' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Fees;
