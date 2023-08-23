import Input from '@/components/Input';
import { cartAtom, countCartAtom, finaliseAtom, reloadAtom, showCartAtom, totalCartAtom } from '@/features/cart';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { postRequest } from '@/lib/api';
import { LoadingButton } from '@mui/lab';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useAtom } from 'jotai';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { currency } from '../../lib/currency';

type Event = { target: { value: string; name: string } };
interface Sale {
  reference: string;
  seller?: string;
  clientName: string;
  clientPhone: string;
  amountPaid: number;
  amountDue: number;
  products: any[];
  totalAmount: number;
  description?: string;
}

const Checkout = () => {
  const { currentUser } = useTypedSelector((state) => state.getCurrentUser);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cart, setCart] = useAtom(cartAtom);
  const [amount, setAmount] = useState('');
  const [, setFinalise] = useAtom(finaliseAtom);
  const [loading, setLoading] = useState(false);
  const [, setShowCart] = useAtom(showCartAtom);
  const [total, _setTotal] = useAtom(totalCartAtom);
  const [count, _setCount] = useAtom(countCartAtom);
  const [reload, setReload] = useAtom(reloadAtom);
  const [description, setDescription] = useState('');

  const reference = `ES${new Date().getDate()}${new Date().getMonth()}${new Date().getFullYear()}/${new Date().getMilliseconds()}`;

  const rest = +amount > total;

  function cleanCart() {
    setName('');
    setPhone('');
    setAmount('');
    setDescription('');
    setCart([]);
    setShowCart(false);
    setFinalise(false);
  }

  async function generateFacture(facture: Sale) {
    const doc = new jsPDF();

    autoTable(doc, {
      head: [['No', 'Produit', 'Description', 'Prix unitaire', 'Quantité', 'Total']],
      body: facture.products.map((el, i) => [
        i + 1,
        el.product?.name,
        el.product?.description,
        currency.format(el?.sellingPrice),
        el?.quantity,
        currency.format(el?.sellingPrice * el?.quantity),
      ]),
      foot: [[{ content: 'Total général', colSpan: 4 }, count, currency.format(total)]],
      startY: 40,
      didDrawPage: function (data) {
        if (data.pageNumber === 1) {
          doc.setFontSize(12);
          doc.text(`${process.env.NEXT_PUBLIC_NAME}`, data.settings.margin.left, 14);
          doc.setFontSize(12);
          doc.text(facture.reference, 210 - data.settings.margin.left, 14, { align: 'right' });
          doc.setFontSize(12);
          doc.text(new Date().toLocaleDateString(), 210 - data.settings.margin.left, 20, { align: 'right' });
          doc.setFontSize(12);
          doc.text(name || '-', 210 - data.settings.margin.left, 26, { align: 'right' });
          doc.setFontSize(12);
          doc.text(phone || '-', 210 - data.settings.margin.left, 32, { align: 'right' });
          doc.setFontSize(12);
          doc.text(`RCCM: ${process.env.NEXT_PUBLIC_RCCM}`, data.settings.margin.left, 20);
          doc.setFontSize(10);
          doc.text(`Total: ${facture.totalAmount}$`, data.settings.margin.left, 26);
          doc.setFontSize(10);
          doc.text(`Dette: ${facture.amountDue}$`, data.settings.margin.left, 32);
          doc.setFontSize(10);
          doc.text(`Desc: ${facture?.description?.substring(0, 110)}...`, data.settings.margin.left, 38);
        }
      },
    });

    doc.save(`${facture.reference}.pdf`);
  }

  async function onPay() {
    setLoading(true);
    const data: Sale = {
      reference,
      seller: currentUser?.user.id,
      clientName: name,
      clientPhone: phone,
      amountPaid: rest ? total : +amount,
      amountDue: rest ? 0 : total - +amount,
      description,
      products: cart.map((el) => ({
        id: undefined,
        product: el?.product?.id,
        quantity: +el.quantity,
        sellingPrice: +el.sellingPrice,
      })),
      totalAmount: total,
    };
    const response = await postRequest({ endpoint: '/sales', data });

    if (response?.error) {
      setLoading(false);
      toast.error(response?.error?.message);
      return;
    }

    if (response.data) {
      toast.success('Payment with success');
      await generateFacture({
        ...data,
        products: cart.map((el) => ({
          id: el.id,
          product: el?.product,
          quantity: +el.quantity,
          sellingPrice: +el.sellingPrice,
        })),
      });
      setLoading(false);
      cleanCart();
      setReload(!reload);
    }
  }

  return (
    <>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Input
            label="Nom"
            value={name}
            placeholder="Entrer le nom"
            handleChange={(e: Event) => setName(e.target.value)}
            name="name"
          />
          <Stack sx={{ width: 1 }} direction="row" spacing={2}>
            <Input
              label="Numéro"
              value={phone}
              placeholder="Entrer le numéro"
              handleChange={(e: Event) => setPhone(e.target.value)}
              name="phone"
            />
            <Input
              label="Montant payé"
              value={amount}
              placeholder="Entrer le montant payé"
              handleChange={(e: Event) => setAmount(e.target.value)}
              name="amount"
              type="number"
            />
          </Stack>
          <Input
            label="Description"
            value={description}
            placeholder="Entrer la description de la facture"
            handleChange={(e: Event) => setDescription(e.target.value)}
            name="description"
            type="textarea"
          />
          <Divider />
          <Stack width={1} padding={2} direction="row" justifyContent="space-between">
            <Typography variant="h6">{rest ? 'Montant à rembourser' : 'Montant restant'}</Typography>
            <Typography variant="h6" color={rest ? 'success.main' : 'inherit'}>
              {rest ? +amount - total : total - +amount}$
            </Typography>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <LoadingButton
          onClick={() => setFinalise(false)}
          size="small"
          variant="outlined"
          disableElevation
          sx={{ py: 1, px: 2 }}
        >
          Retour
        </LoadingButton>
        <LoadingButton
          size="small"
          loading={loading}
          onClick={onPay}
          variant="contained"
          disableElevation
          sx={{ py: 1, px: 2 }}
        >
          Générer la facture
        </LoadingButton>
      </DialogActions>
    </>
  );
};

export default Checkout;
