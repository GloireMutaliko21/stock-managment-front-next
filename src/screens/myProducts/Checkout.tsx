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
import 'dayjs/locale/fr';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { generateEstimation } from '../../utils/generateEstimation';
import { generateFacture } from '../../utils/generateFacture';

type Event = { target: { value: string; name: string } };

export interface Sale {
  reference: string;
  seller?: string;
  clientName?: string;
  clientPhone?: string;
  amountPaid?: number;
  amountDue?: number;
  products?: any[];
  totalAmount?: number;
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
      await generateFacture(
        {
          ...data,
          products: cart.map((el) => ({
            id: el.id,
            product: el?.product,
            quantity: +el.quantity,
            sellingPrice: +el.sellingPrice,
          })),
        },
        currentUser?.user,
        count,
        total,
        name,
        phone
      );
      setLoading(false);
      cleanCart();
      setReload(!reload);
    }
  }

  async function onDraft() {
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

    await generateEstimation(
      {
        ...data,
        products: cart?.map((el) => ({
          id: el.id,
          product: el?.product,
          quantity: +el.quantity,
          sellingPrice: +el.sellingPrice,
        })),
      },
      currentUser?.user,
      count,
      total,
      name,
      phone,
      +amount
    );

    setLoading(false);
    cleanCart();
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
          onClick={onDraft}
          variant="outlined"
          disableElevation
          sx={{ py: 1, px: 2 }}
        >
          Générer un brouillon
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
