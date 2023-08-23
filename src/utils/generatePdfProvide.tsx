import { currency } from '@/lib/currency';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export async function generatePdfProvide(provides: Provide[], user?: User) {
  const doc = new jsPDF('l', 'mm');

  autoTable(doc, {
    head: [
      [
        'No',
        'Nom',
        'Description',
        'Quantité',
        'Prix de vente',
        'État',
        'Catégorie',
        'Date',
        'Fournisseur',
        'Bénéficiaire',
      ],
    ],
    body: provides.map((el, i) => [
      i + 1,
      el.product?.name,
      el.product?.description,
      el?.quantity,
      currency.format(el?.product?.sellingPrice),
      el?.status === 'ACCEPTED' ? 'Accepté' : el.status === 'PENDING' ? 'En attente' : 'Rejeté',
      el.product.category.name,
      dayjs(el.createdAt).locale('fr').format('L LT'),
      `${el.provider.firstName} ${el.provider.lastName}`,
      `${el.recipient.firstName} ${el.recipient.lastName}`,
      currency.format(el?.product?.sellingPrice * el?.quantity),
    ]),
    startY: 25,
    didDrawPage: function (data) {
      if (data.pageNumber === 1) {
        doc.setFontSize(12);
        doc.text(`${process.env.NEXT_PUBLIC_NAME}`, data.settings.margin.left, 14);
        if (user) {
          doc.text(`${user.firstName} ${user.lastName}`, 297 / 2, 14, {
            align: 'center',
          });
        }
        doc.setFontSize(12);
        doc.text(dayjs(new Date()).locale('fr').format('L LT'), 297 - data.settings.margin.left, 14, {
          align: 'right',
        });
      }
    },
  });

  doc.save('Rapport-approvisionnements' + new Date().toLocaleString() + '.pdf');
}
