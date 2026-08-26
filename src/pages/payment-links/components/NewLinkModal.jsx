import { useState } from 'react';
import { color, font } from '../../../styles/theme';
import { Button } from '../../../components/button';
import { Modal } from '../../../components/modal';
import { Field, Select, TextInput } from '../../../components/form';
import { formatCurrency, toCents } from '../../../utils/formatCurrency';

const totalBox = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 14,
  background: color.gray50,
  border: `1px solid ${color.gray200}`,
  borderRadius: 10,
  padding: '12px 14px',
};

const totalValue = {
  fontFamily: font.display,
  fontWeight: 700,
  fontSize: 19,
  color: color.gray900,
};

const centsToInput = (cents) => (cents / 100).toFixed(2);

/**
 * Mounted only while open (and keyed by the open), so the form seeds itself
 * from the chosen product at mount and needs no reset effect.
 */
export function NewLinkModal({ onClose, products, initialProductId, onCreate }) {
  const seed = products.find((p) => p.id === initialProductId) || products[0];

  const [productId, setProductId] = useState(seed?.id ?? '');
  const [amount, setAmount] = useState(seed ? centsToInput(seed.price) : '');
  const [qty, setQty] = useState('1');
  const [customer, setCustomer] = useState('');

  const handleProductChange = (event) => {
    const next = products.find((p) => p.id === event.target.value);
    setProductId(event.target.value);
    if (next) setAmount(centsToInput(next.price));
  };

  const quantity = Math.max(1, parseInt(qty, 10) || 1);
  const total = toCents(amount) * quantity;
  const product = products.find((p) => p.id === productId);

  const handleCreate = () => {
    if (!product || total <= 0) return;
    /* Stripe bills unit_amount × quantity, so send the per-unit amount. */
    onCreate({
      productId: product.id,
      amount: toCents(amount),
      quantity,
      customerName: customer,
    });
    onClose();
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="New payment link"
      subtitle="Share it anywhere — paid links land in the ledger."
      footer={
        <>
          <Button variant="ghost" size="lg" onClick={onClose}>
            Cancel
          </Button>
          <Button size="lg" onClick={handleCreate} disabled={!product || total <= 0}>
            Create link
          </Button>
        </>
      }
    >
      <Field label="Product">
        <Select value={productId} onChange={handleProductChange}>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} · {formatCurrency(p.price)}
            </option>
          ))}
        </Select>
      </Field>

      <div style={{ display: 'flex', gap: 12 }}>
        <Field label="Amount (CAD)" style={{ flex: 1 }}>
          <TextInput value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" />
        </Field>
        <Field label="Qty" style={{ width: 104 }}>
          <TextInput value={qty} onChange={(e) => setQty(e.target.value)} inputMode="numeric" />
        </Field>
      </div>

      <Field label="Customer name">
        <TextInput
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          placeholder="Optional"
        />
      </Field>

      <div style={totalBox}>
        <span style={{ fontSize: 13, color: color.gray700 }}>Customer pays</span>
        <span style={totalValue}>{formatCurrency(total)}</span>
      </div>
    </Modal>
  );
}
