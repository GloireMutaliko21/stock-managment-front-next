import { currency } from '@/lib/currency';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/fr';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export async function generatePdfSale(provides: Sale[], startDate: Dayjs | null, endDate: Dayjs | null, user?: User) {
  const getPdfTitle = () => {
    if (startDate && endDate) {
      return `Rapport-ventes du ${dayjs(startDate).locale('fr').format('L LT')} au ${dayjs(endDate)
        .locale('fr')
        .format('L LT')}`;
    } else {
      return 'Rapport-ventes-complet';
    }
  };
  const doc = new jsPDF('l', 'mm');

  autoTable(doc, {
    head: [
      [
        'No',
        'Date',
        'Référence',
        'État',
        'Nom du client',
        'Numéro du client',
        'Nom du vendeur',
        'Montant payé',
        'Dette',
        'Prix total',
      ],
    ],
    body: provides.map((el, i) => [
      i + 1,
      dayjs(el.createdAt).locale('fr').format('L LT'),
      el.facture.reference,
      el.facture.amountDue > 0 ? 'Impayé' : 'Payé',
      el.facture.clientName || 'N/A',
      el.facture.clientPhone || 'N/A',
      `${el.seller.firstName} ${el.seller.lastName}`,
      currency.format(el?.facture.amountPaid),
      currency.format(el?.facture.amountDue),
      currency.format(el?.facture.totalAmount),
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

  doc.save(getPdfTitle() + '.pdf');
}
