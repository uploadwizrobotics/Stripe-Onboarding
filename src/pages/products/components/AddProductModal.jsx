import { useState } from 'react';
import { Button } from '../../../components/button';
import { Modal } from '../../../components/modal';
import { Field, TextInput } from '../../../components/form';
import { font } from '../../../styles/theme';
import { toCents } from '../../../utils/formatCurrency';

/* No status field: the admin only lists active products, and there's no way
   to un-archive one from here, so everything created is live. */
const EMPTY = { name: '', blurb: '', price: '', sku: '' };

export function AddProductModal({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY);

  const set = (key) => (event) => setForm((f) => ({ ...f, [key]: event.target.value }));

  const handleSave = () => {
    if (!form.name.trim()) return;
    /* The API takes amounts in cents, like every Stripe amount. */
    onSave({ ...form, price: toCents(form.price) });
    setForm(EMPTY);
    onClose();
  };

  const handleClose = () => {
    setForm(EMPTY);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      zIndex={45}
      title="Add a product"
      subtitle="A plan, a service, or a physical item."
      footer={
        <>
          <Button variant="ghost" size="lg" onClick={handleClose}>
            Cancel
          </Button>
          <Button size="lg" onClick={handleSave} disabled={!form.name.trim()}>
            Save product
          </Button>
        </>
      }
    >
      <Field label="Name">
        <TextInput value={form.name} onChange={set('name')} placeholder="Basic Plan" />
      </Field>

      <Field label="Description">
        <TextInput
          value={form.blurb}
          onChange={set('blurb')}
          placeholder="Monthly subscription · single seat"
        />
      </Field>

      <div style={{ display: 'flex', gap: 12 }}>
        <Field label="Price (CAD)" style={{ flex: 1 }}>
          <TextInput value={form.price} onChange={set('price')} placeholder="29" inputMode="decimal" />
        </Field>
        <Field label="SKU" style={{ flex: 1 }}>
          <TextInput
            value={form.sku}
            onChange={set('sku')}
            placeholder="Auto-generated"
            style={{ fontFamily: font.mono }}
          />
        </Field>
      </div>
    </Modal>
  );
}
