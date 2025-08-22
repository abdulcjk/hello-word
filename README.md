# PnPStore - Modern E-commerce Website

A complete, modern, and responsive e-commerce website built with vanilla HTML, CSS, and JavaScript. PnPStore provides a full-featured online shopping experience with an admin panel for product management.

## 🚀 Features

### Customer Features
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Product Catalog**: Browse products with search, filter, and sort functionality
- **Product Details**: Detailed product pages with image gallery and specifications
- **Shopping Cart**: Add, remove, and manage items with real-time calculations
- **User Authentication**: Secure login and registration system
- **Contact Form**: Get in touch with customer support

### Admin Features
- **Admin Dashboard**: Overview of store statistics and recent activity
- **Product Management**: Add, edit, and delete products with full CRUD operations
- **Bulk Import**: Import products via CSV or JSON files
- **Data Export**: Export product data in CSV or JSON formats
- **Secure Access**: Admin panel protected by authentication

### Technical Features
- **Modern UI/UX**: Clean, professional design with smooth animations
- **Local Storage**: Data persistence using browser localStorage
- **Form Validation**: Client-side validation with error handling
- **Image Handling**: Fallback images and error handling
- **Search & Filter**: Real-time product search and category filtering
- **Mobile-First**: Responsive design starting from mobile devices

## 📁 Project Structure

```
PnPStore/
├── index.html              # Homepage
├── products.html           # Product listing page
├── product-detail.html     # Individual product page
├── cart.html              # Shopping cart page
├── contact.html           # Contact form page
├── login.html             # User login page
├── signup.html            # User registration page
├── admin.html             # Admin panel
├── create_logo.html       # Logo generator utility
├── css/
│   └── style.css          # Main stylesheet
├── js/
│   ├── products.js        # Product management and display
│   ├── cart.js           # Shopping cart functionality
│   ├── auth.js           # Authentication system
│   ├── admin.js          # Admin panel functionality
│   ├── product-detail.js # Product detail page logic
│   └── main.js           # Utility functions and common code
├── images/
│   ├── logo.png          # Company logo
│   ├── logo.svg          # SVG version of logo
│   └── favicon.ico       # Website favicon
└── README.md             # This file
```

## 🛠 Setup Instructions

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A web server (optional, but recommended for full functionality)

### Local Development Setup

1. **Clone or Download**: Get the project files to your local machine

2. **Serve the Files**: 
   - **Option 1 - Simple HTTP Server (Python)**:
     ```bash
     cd PnPStore
     python -m http.server 8000
     ```
     Then open `http://localhost:8000` in your browser

   - **Option 2 - Node.js HTTP Server**:
     ```bash
     npx http-server
     ```

   - **Option 3 - PHP Built-in Server**:
     ```bash
     php -S localhost:8000
     ```

   - **Option 4 - Direct File Access**: 
     Simply open `index.html` in your browser (some features may be limited)

3. **Access the Website**: Open your browser and navigate to the local server URL

## 📖 Usage Guide

### For Customers

1. **Browse Products**:
   - Visit the homepage to see featured products
   - Go to "Products" to see the full catalog
   - Use search and filters to find specific items

2. **View Product Details**:
   - Click on any product to see detailed information
   - View product images, specifications, and pricing
   - Adjust quantity and add to cart

3. **Shopping Cart**:
   - Click the cart icon to view your items
   - Modify quantities or remove items
   - See real-time price calculations including tax and shipping
   - Proceed to checkout (demo functionality)

4. **User Account**:
   - Sign up for a new account or login
   - Access personalized features

### For Administrators

1. **Admin Access**:
   - Login with admin credentials:
     - **Email**: admin@pnpstore.com
     - **Password**: admin123
   - Or use the "Quick Admin Login" button on the login page

2. **Dashboard**:
   - View store statistics and recent activity
   - Monitor total products and other metrics

3. **Product Management**:
   - **Add Products**: Use the "Add Product" section to create new items
   - **Edit Products**: Click edit button in the products table
   - **Delete Products**: Remove unwanted items
   - **Bulk Import**: Upload CSV or JSON files with product data

4. **Data Management**:
   - Export products to CSV or JSON format
   - Backup and restore store data

## 🎨 Customization

### Styling
- Modify `css/style.css` to change colors, fonts, and layout
- CSS variables are used for easy theme customization
- Responsive breakpoints can be adjusted for different devices

### Functionality
- Add new features by extending the JavaScript modules
- Modify product data structure in `js/products.js`
- Customize form validation in `js/main.js`

### Content
- Update company information in HTML files
- Replace placeholder images with actual product photos
- Modify text content and descriptions

## 🔧 Configuration

### Default Settings
- **Tax Rate**: 8.5% (configurable in `js/cart.js`)
- **Free Shipping Threshold**: $50
- **Products Per Page**: 9 items
- **Max Quantity Per Item**: 10

### Admin Credentials
- **Default Admin Email**: admin@pnpstore.com
- **Default Admin Password**: admin123

**⚠️ Important**: Change default admin credentials before deploying to production!

## 📊 Demo Data

The website comes with 12 pre-loaded demo products across three categories:
- **Electronics**: Headphones, smartwatch, webcam, charging pad, security camera
- **Fashion**: T-shirts, crossbody bag, sunglasses, running shoes
- **Home & Garden**: Coffee maker, plant collection, dinnerware set

## 🚀 Deployment

### Static Hosting
This website can be deployed on any static hosting service:

1. **Namecheap**: Upload files via cPanel File Manager
2. **Netlify**: Drag and drop the project folder
3. **Vercel**: Connect to a Git repository
4. **GitHub Pages**: Push to a GitHub repository
5. **AWS S3**: Upload as a static website

### Deployment Checklist
- [ ] Update admin credentials
- [ ] Replace demo images with real product photos
- [ ] Update company contact information
- [ ] Test all functionality on the live site
- [ ] Set up proper error pages (404, etc.)

## 🔒 Security Considerations

### Current Implementation
- Client-side authentication (demo purposes only)
- Input validation and sanitization
- XSS protection through proper data handling
- Admin panel access control

### Production Recommendations
- Implement server-side authentication
- Use HTTPS for all communications
- Add rate limiting for forms
- Implement proper session management
- Use environment variables for sensitive data

## 🌟 Browser Compatibility

- **Chrome**: 60+
- **Firefox**: 55+
- **Safari**: 12+
- **Edge**: 79+
- **Mobile Browsers**: iOS Safari 12+, Chrome Mobile 60+

## 🤝 Contributing

This is a complete, self-contained project designed for immediate use. However, you can extend it by:

1. Adding new product categories
2. Implementing additional payment methods
3. Adding user reviews and ratings
4. Creating a wishlist feature
5. Adding inventory management

## 📄 License

This project is created as a complete e-commerce solution. Feel free to use, modify, and distribute according to your needs.

## 📞 Support

For questions about setup or customization:
1. Check the browser console for any JavaScript errors
2. Ensure all files are properly uploaded to your server
3. Verify that your web server supports the required file types

## 🎯 Performance Tips

- Optimize images before uploading
- Enable gzip compression on your server
- Use a CDN for better global performance
- Minify CSS and JavaScript for production

---

**PnPStore** - Your complete e-commerce solution, ready to deploy! 🛍️
