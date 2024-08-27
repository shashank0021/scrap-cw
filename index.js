import axios from 'axios';
import * as cheerio from 'cheerio';
import xl from 'excel4node';

async function getData() {

   const allProducts = [];
   const productName = [];
   const productPrice = [];
   const productRatings = [];

   const wb = new xl.Workbook();
   const ws = wb.addWorksheet('allProducts');

   // Define column headings
   const headingColumnNames = ['ID', 'Product Name', 'Price', 'Rating'];

   // Add column headings to the worksheet
   let headingColumnIndex = 1;
   headingColumnNames.forEach(heading => {
      ws.cell(1, headingColumnIndex++).string(heading);
   });

   try {
      const response = await axios.get('https://www.meesho.com/men-watches/pl/3k7');
      // console.log(response.data);

      const $ = cheerio.load(response.data);

      // Product name.
      $('.NewProductCardstyled__StyledDesktopProductTitle-sc-6y2tys-5.ejhQZU').each((index, element) => {
         const pName = $(element).text()
         productName.push(pName);
      })

      // Product price
      $('h5').each((index, element) => {
         const pPrice = $(element).text().trim();
         const price = pPrice.replace(' onwards', '');
         productPrice.push(price)
      })
      // Product price
      $('.sc-eDvSVe.laVOtN').each((index, element) => {
         const pRatings = $(element).text().trim();
         productRatings.push(pRatings);
      })

      // Making all data in json form
      for (let i = 0; i < productName.length; i++) {
         const products = {
            id: i,
            name: productName[i] || 'N/A',
            price: productPrice[i] || 'N/A',
            rating: productRatings[i] || 'N/A',
         }
         allProducts.push(products);
      }
      // console.log(allProducts);

      let rowIndex = 2; // Start from the second row after the headers
      allProducts.forEach(product => {
         ws.cell(rowIndex, 1).number(product.id);
         ws.cell(rowIndex, 2).string(product.name);
         ws.cell(rowIndex, 3).string(product.price);
         ws.cell(rowIndex, 4).string(product.rating);
         rowIndex++;
      });

      // Write the workbook to a file
      wb.write('AllProducts.xlsx', (err, stats) => {
         if (err) {
            console.error('Error saving the Excel file:', err);
         } else {
            console.log('Excel file saved successfully!');
         }
      });
   }
   catch (err) {
      console.log(err);

   }

}
getData();





// https://www.snapdeal.com/products/men-apparel?sort=plrty