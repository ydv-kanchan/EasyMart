use ecommerce;
INSERT INTO items (item_name, item_desc, item_price, item_stock, item_image, vendor_id, category_id, item_type_id)
VALUES
('Classic White T-Shirt', 'A comfy cotton t-shirt perfect for daily wear.', 499.00, 50, '/uploads/products/cwhite-tshirt.jpg', 3, 1, 1),
('Denim Jeans', 'Slim fit blue denim jeans.', 999.00, 40, '/uploads/products/denim.jpeg', 3, 1, 1),
('Black Sneakers', 'Casual sneakers with cushioned soles.', 1299.00, 30, '/uploads/products/black-sneakers.jpeg', 3, 1, 3),
('Floral Dress', 'Chic floral dress for summer outings.', 899.00, 25, '/uploads/products/flora-dress.jpeg', 3, 1, 2),
('Kids Hoodie', 'Warm and colorful emailhoodie for kids.', 699.00, 20, '/uploads/products/kid-hoodie.jpeg', 3, 1, 4);

SET SQL_SAFE_UPDATES = 0;
UPDATE items
SET item_image = '/uploads/products/tshirt-white.jpeg'
WHERE item_name = 'Classic White T-Shirt';
SET SQL_SAFE_UPDATES = 1;


SET SQL_SAFE_UPDATES = 0;
DELETE FROM items
WHERE item_name = 'Floral Dress';
SET SQL_SAFE_UPDATES = 1;


INSERT INTO items (item_name, item_desc, item_price, item_stock, item_image, vendor_id, category_id, item_type_id)
VALUES
('Polo Shirt', 'Smart casual polo shirt ideal for semi-formal outings.', 799.00, 35, '/uploads/products/polo-shirt.jpeg', 3, 1, 1),
('Chino Pants', 'Comfortable and versatile chino pants for daily wear.', 899.00, 28, '/uploads/products/chino-pants.jpeg', 3, 1, 1),
('Leather Loafers', 'Premium leather loafers suitable for both office and parties.', 1799.00, 15, '/uploads/products/leather-loafers.jpeg', 3, 1, 3),
('Hooded Sweatshirt', 'Cozy hooded sweatshirt for winter comfort.', 1099.00, 22, '/uploads/products/hooded-sweatshirt.jpeg', 3, 1, 1);

INSERT INTO items (item_name, item_desc, item_price, item_stock, item_image, vendor_id, category_id, item_type_id)
VALUES
('Floral Mini Dress', 'Flowy floral maini dress perfect for summer.', 1199.00, 30, '/uploads/products/floral-mini.jpeg', 3, 2, 2),
('High-Waisted Skirt', 'Elegant high-waisted skirt for casual and formal wear.', 799.00, 25, '/uploads/products/high-waisted-skirt.jpeg', 3, 2, 1),
('Ruffle Blouse', 'Lightweight ruffle blouse with feminine detailing.', 699.00, 35, '/uploads/products/ruffle-blouse.jpeg', 3, 2, 1),
('Cropped Denim Jacket', 'Trendy cropped denim jacket for layering.', 999.00, 20, '/uploads/products/denim-jacket.jpeg', 3, 2, 1),
('Palazzo Pants', 'Comfortable and breezy palazzo pants in solid colors.', 899.00, 18, '/uploads/products/palazzo-pants.jpeg', 3, 2, 1);

SET SQL_SAFE_UPDATES = 0;
UPDATE items
SET category_id = 1
WHERE item_name = 'Floral Mini Dress';


UPDATE items
SET category_id = 1
WHERE item_name = 'High-Waisted Skirt';

UPDATE items
SET category_id = 1
WHERE item_name = 'Ruffle Blouse';

UPDATE items
SET category_id = 1
WHERE item_name = 'Cropped Denim Jacket';

UPDATE items
SET category_id = 1
WHERE item_name = 'Palazzo Pants';

UPDATE items
SET item_type_id = 2
WHERE item_name = 'Floral Mini Dress';

UPDATE items
SET item_type_id = 2
WHERE item_name = 'High-Waisted Skirt';

UPDATE items
SET item_type_id = 2
WHERE item_name = 'Ruffle Blouse';

UPDATE items
SET item_type_id = 2
WHERE item_name = 'Cropped Denim Jacket';

UPDATE items
SET item_type_id = 2
WHERE item_name = 'Palazzo Pants';



INSERT INTO items (item_name, item_desc, item_price, item_stock, item_image, vendor_id, category_id, item_type_id)
VALUES
('Kids Cartoon T-Shirt', 'Fun cartoon-printed t-shirt for everyday wear.', 399.00, 40, '/uploads/products/kids-cartoon-tshirt.jpeg', 3, 3, 4),
('Printed Shorts', 'Light and comfy shorts with playful prints.', 349.00, 35, '/uploads/products/kids-printed-shorts.jpeg', 3, 3, 4),
('Dungaree Set', 'Adorable dungaree with inner t-shirt combo.', 799.00, 20, '/uploads/products/kids-dungaree.jpeg', 3, 3, 4),
('Frock with Bow', 'Pretty frock with bow detailing for parties.', 699.00, 30, '/uploads/products/kids-frock.jpeg', 3, 3, 4);

UPDATE items
SET category_id = 1, item_type_id = 4
WHERE item_name = 'Kids Cartoon T-Shirt';

UPDATE items
SET category_id = 1, item_type_id = 4
WHERE item_name = 'Printed Shorts';

UPDATE items
SET category_id = 1, item_type_id = 4
WHERE item_name = 'Dungaree Set';

UPDATE items
SET category_id = 1, item_type_id = 4
WHERE item_name = 'Frock with Bow';


INSERT INTO items (item_name, item_desc, item_price, item_stock, item_image, vendor_id, category_id, item_type_id)
VALUES
('Women\'s Ballet Flats', 'Elegant and comfortable ballet flats for daily wear.', 799.00, 20, '/uploads/products/ballet-flats.jpeg', 3, 1, 3),
('Block Heel Sandals', 'Stylish block heel sandals perfect for casual outings.', 1099.00, 18, '/uploads/products/block-heels.jpeg', 3, 1, 3),
('Running Sneakers', 'Lightweight sneakers designed for active women.', 1299.00, 15, '/uploads/products/women-sneakers.jpeg', 3, 1, 3);

select * from item_types;

INSERT INTO items (item_name, item_desc, item_price, item_stock, item_image, vendor_id, category_id, item_type_id)
VALUES
('Hydrating Face Cream', 'Moisturizes and nourishes dry skin.', 599.00, 40, '/uploads/products/face-cream.jpeg', 3, 2, 5),
('Aloe Vera Gel', 'Soothes and cools irritated skin.', 349.00, 50, '/uploads/products/aloe-vera.jpeg', 3, 2, 5),
('Vitamin C Serum', 'Brightens and evens skin tone.', 799.00, 30, '/uploads/products/vitamin-c-serum.jpeg', 3, 2, 5),
('Sunscreen SPF 50', 'Protects skin from harmful UV rays.', 699.00, 35, '/uploads/products/sunscreen.jpeg', 3, 2, 5),
('Charcoal Face Mask', 'Deep cleanses and detoxifies skin.', 499.00, 25, '/uploads/products/charcoal-mask.jpeg', 3, 2, 5);

INSERT INTO items (item_name, item_desc, item_price, item_stock, item_image, vendor_id, category_id, item_type_id)
VALUES
('Herbal Shampoo', 'Gentle cleansing with herbal extracts.', 399.00, 40, '/uploads/products/herbal-shampoo.jpeg', 3, 2, 6),
('Hair Conditioner', 'Softens and nourishes hair.', 449.00, 30, '/uploads/products/conditioner.jpeg', 3, 2, 6),
('Hair Serum', 'Adds shine and reduces frizz.', 599.00, 25, '/uploads/products/hair-serum.jpeg', 3, 2, 6),
('Hair Mask', 'Deep conditioning mask for damaged hair.', 349.00, 50, '/uploads/products/hair-mask.jpeg', 3, 2, 6),
('Dry Shampoo', 'Instant freshness without water.', 499.00, 20, '/uploads/products/dry-shampoo.jpeg', 3, 2, 6);

INSERT INTO items (item_name, item_desc, item_price, item_stock, item_image, vendor_id, category_id, item_type_id)
VALUES
('Matte Lipstick', 'Long-lasting matte finish.', 299.00, 50, '/uploads/products/lipstick.jpeg', 3, 2, 7),
('Liquid Foundation', 'Smooth coverage for all skin types.', 699.00, 30, '/uploads/products/foundation.jpeg', 3, 2, 7),
('Eyeshadow Palette', '12 vibrant shades for every look.', 799.00, 20, '/uploads/products/eyeshadow.jpeg', 3, 2, 7),
('Kajal Stick', 'Smudge-proof and long-lasting.', 199.00, 60, '/uploads/products/kajal.jpeg', 3, 2, 7),
('Makeup Setting Spray', 'Keeps makeup in place all day.', 499.00, 25, '/uploads/products/setting-spray.jpeg', 3, 2, 7);

INSERT INTO items (item_name, item_desc, item_price, item_stock, item_image, vendor_id, category_id, item_type_id)
VALUES
('Floral Body Mist', 'Light and fresh floral scent.', 599.00, 35, '/uploads/products/body-mist.jpeg', 3, 2, 8),
('Woody Perfume Spray', 'Bold and earthy fragrance.', 899.00, 20, '/uploads/products/woody-perfume.jpeg', 3, 2, 8),
('Vanilla Scented Roll-on', 'Sweet and subtle daily fragrance.', 299.00, 50, '/uploads/products/vanilla-rollon.jpeg', 3, 2, 8),
('Ocean Breeze EDT', 'Cool and refreshing fragrance.', 749.00, 30, '/uploads/products/ocean-breeze.jpeg', 3, 2, 8),
('Luxury Perfume Set', 'Gift set with 3 mini perfumes.', 1499.00, 15, '/uploads/products/perfume-set.jpeg', 3, 2, 8);