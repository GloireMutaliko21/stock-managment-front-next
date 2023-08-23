import { currency } from '@/lib/currency';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export async function generateEstimation(
  facture: any,
  seller: any,
  count: number,
  total: number,
  name?: string,
  phone?: string,
  amount: number = 0
) {
  const doc = new jsPDF({
    format: '',
  });

  autoTable(doc, {
    head: [['No', 'Produit', 'Description', 'Prix unitaire', 'Quantité', 'Prix total']],
    body: facture?.products?.map((el: any, i: number) => [
      i + 1,
      el.product?.name,
      el.product?.description,
      currency.format(el?.sellingPrice),
      el?.quantity,
      currency.format(el?.sellingPrice * el?.quantity),
    ]),
    foot: [[{ content: 'Total général', colSpan: 4 }, count, currency.format(total)]],
    startY: 60,
    didDrawPage: function (data) {
      if (data.pageNumber === 1) {
        doc.setFontSize(12);
        doc.text(`${process.env.NEXT_PUBLIC_NAME}`, data.settings.margin.left, 14);
        doc.setFontSize(12);
        doc.text('Facture Brouillon', 210 - data.settings.margin.left, 14, { align: 'right' });
        doc.setFontSize(12);
        doc.text(dayjs(new Date()).locale('fr').format('L LT'), 210 - data.settings.margin.left, 20, {
          align: 'right',
        });
        doc.setFontSize(12);
        doc.text(name || '-', 210 - data.settings.margin.left, 26, { align: 'right' });
        doc.setFontSize(12);
        doc.text(phone || '-', 210 - data.settings.margin.left, 32, { align: 'right' });
        doc.setFontSize(12);
        doc.text(`RCCM: ${process.env.NEXT_PUBLIC_RCCM}`, data.settings.margin.left, 20);
        doc.setFontSize(12);
        doc.text(`Total: ${facture.totalAmount}$`, data.settings.margin.left, 26);
        doc.setFontSize(12);
        doc.text(`Montant: ${amount}$`, data.settings.margin.left, 32);
        doc.setFontSize(12);
        doc.text(`Retour: ${amount > total ? amount - total : 0}$`, data.settings.margin.left, 38);
        doc.setFontSize(12);
        doc.text(`Vendeur: ${seller?.firstName} ${seller?.lastName}`, data.settings.margin.left, 44);
        doc.setFontSize(10);
        doc.text(`Desc: ${facture?.description?.substring(0, 110)}...`, data.settings.margin.left, 52);
      }
    },
  });

  doc.save(`${facture.reference}.pdf`);
}
