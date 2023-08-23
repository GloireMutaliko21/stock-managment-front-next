import { currency } from '@/lib/currency';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/fr';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Inventory } from '../features/users/inventory';

export async function generatePdfInventory(inventory: Inventory[], startDate: Dayjs | null, endDate: Dayjs | null) {
  const doc = new jsPDF('l', 'mm');

  const getPdfTitle = () => {
    if (startDate && endDate) {
      return `Inventaire du ${dayjs(startDate).locale('fr').format('L LT')} au ${dayjs(endDate)
        .locale('fr')
        .format('L LT')}`;
    } else {
      return 'Inventaire-complet';
    }
  };

  autoTable(doc, {
    head: [
      [
        'No',
        'Nom du vendeur',
        'Produits reçus',
        'Produits vendus',
        'Bénéfice',
        'Produits en stock',
        'Montant généré',
        'Dette',
        'Montant payé',
      ],
    ],
    body: inventory.map((el, i: number) => [
      i + 1,
      el.firstName + ' ' + el.lastName,
      el.provides,
      el.sales,
      currency.format(el.beneficiary),
      el.stock,
      currency.format(el.totalAmount),
      currency.format(el.amountDue),
      currency.format(el.amountPaid),
    ]),
    startY: 25,
    didDrawPage: function (data) {
      if (data.pageNumber === 1) {
        doc.setFontSize(12);
        doc.text(`${process.env.NEXT_PUBLIC_NAME}`, data.settings.margin.left, 14);
        doc.setFontSize(12);
        doc.text(dayjs(new Date()).locale('fr').format('L LT'), 297 - data.settings.margin.left, 14, {
          align: 'right',
        });
      }
    },
  });

  doc.save(getPdfTitle() + '.pdf');
}
