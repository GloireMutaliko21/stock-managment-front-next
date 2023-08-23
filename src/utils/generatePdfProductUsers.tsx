import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export async function generatePdfProductUsers(products: MyProduct[], user?: User) {
  const doc = new jsPDF();

  autoTable(doc, {
    head: [['No', 'Nom du produit', 'Catégorie', 'Stock']],
    body: products?.map((el, i) => [i + 1, el.product.name, el.product.category.name, el.stock]),
    startY: 20,
    didDrawPage: function (data) {
      if (data.pageNumber === 1) {
        doc.setFontSize(12);
        doc.text(`${process.env.NEXT_PUBLIC_NAME}`, data.settings.margin.left, 14);
        if (user) {
          doc.text(`${user.firstName} ${user.lastName}`, 210 / 2, 14, {
            align: 'center',
          });
        }
        doc.setFontSize(12);
        doc.text(dayjs(new Date()).locale('fr').format('L LT'), 210 - data.settings.margin.left, 14, {
          align: 'right',
        });
      }
    },
  });

  doc.save(`Produits-par-utilisateurs ${new Date().toLocaleDateString()}` + '.pdf');
}
