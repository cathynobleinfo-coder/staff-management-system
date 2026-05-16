'use client';

import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { addStaff } from '@/actions/staff';
import styles from '@/components/Modal.module.css';

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddStaffModal({ isOpen, onClose }: AddStaffModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await addStaff(formData);

    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      onClose();
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Add New Staff</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.9rem', background: '#fef2f2', padding: '0.5rem', borderRadius: '4px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="empId">Employee ID</label>
            <input id="empId" name="empId" type="text" className="input" required placeholder="e.g., EMP005" />
          </div>

          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <input id="name" name="name" type="text" className="input" required placeholder="e.g., John Doe" />
          </div>

          <div className="input-group">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" className="input" required defaultValue="DEPUTATION">
              <option value="DEPUTATION">Deputation</option>
              <option value="CONTRACT">Contract</option>
              <option value="DAILY">Daily Wages</option>
              <option value="SERVICE">Service Provider</option>
            </select>
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className="btn btn-outline">Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              <Save size={16} /> {loading ? 'Saving...' : 'Save Staff'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
