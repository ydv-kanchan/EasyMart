use ecommerce;
show tables;
select * from vendors;
select * from vendor_categories;
select * from categories;
select * from item_types;
select * from items;
select count(*) from items;

INSERT INTO items (item_name, item_desc, item_price, item_stock, item_image, vendor_id, category_id, item_type_id)
VALUES
('Cozy Bear', 'A cuddly beige teddy bear with super soft fur.', 1199.00, 25, '/uploads/products/soft_toy1.jpg', 4, 3, 9),
('Dream Bunny', 'An adorable white bunny with floppy ears.', 1099.00, 30, '/uploads/products/soft_toy2.jpg', 4, 3, 9),
('Smiley Elephant', 'A cheerful grey elephant plush with big floppy ears.', 1299.00, 20, '/uploads/products/soft_toy3.jpg', 4, 3, 9),
('Sleepy Puppy', 'A soft brown puppy plush perfect for cuddling.', 1149.00, 28, '/uploads/products/soft_toy4.jpg', 4, 3, 9),
('Tiny Dino', 'A small green dinosaur plush toy with cute little spikes.', 1399.00, 22, '/uploads/products/soft_toy5.jpg', 4, 3, 9);


INSERT INTO items (item_name, item_desc, item_price, item_stock, item_image, vendor_id, category_id, item_type_id)
VALUES
('Speed Racer Car', 'A high-speed remote control race car with sleek design.', 2499.00, 15, '/uploads/products/remote_toy1.jpg', 4, 3, 10),
('Sky Hawk Drone', 'A lightweight remote-controlled drone perfect for beginners.', 4599.00, 10, '/uploads/products/remote_toy2.jpg', 4, 3, 10),
('Monster Truck Max', 'A rugged remote control monster truck built for off-road fun.', 3299.00, 18, '/uploads/products/remote_toy3.jpg', 4, 3, 10),
('Aqua Jet Boat', 'A fast remote-controlled boat designed for smooth water racing.', 2899.00, 12, '/uploads/products/remote_toy4.jpg', 4, 3, 10),
('HeliTwist Chopper', 'A colorful remote control helicopter with smooth flight controls.', 3799.00, 14, '/uploads/products/remote_toy5.jpg', 4, 3, 10);


INSERT INTO items (item_name, item_desc, item_price, item_stock, item_image, vendor_id, category_id, item_type_id)
VALUES
('Mystery Maze', 'A challenging 3D maze puzzle that twists and turns.', 1599.00, 20, '/uploads/products/puzzle_toy1.jpg', 4, 3, 11),
('Brain Buster Cube', 'A colorful cube puzzle designed to test your logic skills.', 1399.00, 25, '/uploads/products/puzzle_toy2.jpg', 4, 3, 11),
('Hidden Treasure Puzzle', 'An adventurous puzzle game uncovering hidden treasures.', 1799.00, 18, '/uploads/products/puzzle_toy3.jpg', 4, 3, 11),
('Galaxy Quest Puzzle', 'A space-themed jigsaw puzzle with stunning cosmic scenes.', 1499.00, 22, '/uploads/products/puzzle_toy4.jpg', 4, 3, 11),
('Animal Kingdom Puzzle', 'A fun and educational animal-themed puzzle set.', 1699.00, 24, '/uploads/products/puzzle_toy5.jpg', 4, 3, 11);


INSERT INTO items (item_name, item_desc, item_price, item_stock, item_image, vendor_id, category_id, item_type_id)
VALUES
('Castle Conquer', 'A thrilling strategy board game of kingdoms and battles.', 1999.00, 20, '/uploads/products/board_toy1.jpg', 4, 3, 12),
('Treasure Trail', 'An adventurous board game where players race to find hidden treasure.', 1899.00, 18, '/uploads/products/board_toy2.jpg', 4, 3, 12),
('Mystic Quest', 'A magical journey board game filled with quests and surprises.', 2099.00, 15, '/uploads/products/board_toy3.jpg', 4, 3, 12),
('City Builders', 'A creative board game where players design and build their dream city.', 1799.00, 22, '/uploads/products/board_toy4.jpg', 4, 3, 12),
('Battle of Heroes', 'An action-packed board game featuring epic hero battles.', 2199.00, 17, '/uploads/products/board_toy5.jpg', 4, 3, 12);



INSERT INTO items (item_name, item_desc, item_price, item_stock, item_image, vendor_id, category_id, item_type_id)
VALUES
('ChefMaster Knife Set', 'A premium stainless steel kitchen knife set for all your cooking needs.', 3499.00, 20, '/uploads/products/kitchen_home1.jpg', 4, 4, 13),
('SmartBlend Mixer', 'A powerful kitchen blender perfect for smoothies, soups, and sauces.', 4299.00, 15, '/uploads/products/kitchen_home2.jpg', 4, 4, 13),
('QuickBoil Electric Kettle', 'A fast-heating electric kettle with automatic shut-off feature.', 2499.00, 18, '/uploads/products/kitchen_home3.jpg', 4, 4, 13),
('HomeBrew Coffee Maker', 'A stylish coffee maker designed for rich, fresh coffee every morning.', 5199.00, 12, '/uploads/products/kitchen_home4.jpg', 4, 4, 13),
('ProGrill Sandwich Maker', 'A non-stick sandwich maker perfect for quick and easy meals.', 2799.00, 22, '/uploads/products/kitchen_home5.jpg', 4, 4, 13);


INSERT INTO items (item_name, item_desc, item_price, item_stock, item_image, vendor_id, category_id, item_type_id)
VALUES
('EcoChef Frying Pan', 'A durable non-stick frying pan ideal for healthy cooking.', 2199.00, 20, '/uploads/products/cookware_home1.jpg', 4, 4, 14),
('SteelPro Cooking Pot', 'A large stainless steel pot perfect for soups, stews, and pasta.', 3299.00, 18, '/uploads/products/cookware_home2.jpg', 4, 4, 14),
('GrillMate Griddle', 'A versatile stovetop griddle great for pancakes, bacon, and more.', 2899.00, 15, '/uploads/products/cookware_home3.jpg', 4, 4, 14),
('ChefLine Saucepan Set', 'A set of premium non-stick saucepans with heat-resistant handles.', 3999.00, 12, '/uploads/products/cookware_home4.jpg', 4, 4, 14),
('BakersChoice Casserole Dish', 'An oven-safe casserole dish perfect for baking and serving meals.', 3599.00, 17, '/uploads/products/cookware_home5.jpg', 4, 4, 14);



INSERT INTO items (item_name, item_desc, item_price, item_stock, item_image, vendor_id, category_id, item_type_id)
VALUES
('SmartStore Container Set', 'A stackable airtight container set for keeping food fresh and organized.', 2599.00, 25, '/uploads/products/storage_home1.jpg', 4, 4, 15),
('FlexiBin Storage Box', 'A durable plastic storage box perfect for home or office organization.', 1999.00, 20, '/uploads/products/storage_home2.jpg', 4, 4, 15),
('KitchenMate Spice Jars', 'A sleek set of spice jars with easy-pour lids for your kitchen essentials.', 1799.00, 30, '/uploads/products/storage_home3.jpg', 4, 4, 15),
('FreshSeal Lunch Boxes', 'Microwave-safe lunch boxes with leak-proof locking lids.', 1499.00, 28, '/uploads/products/storage_home4.jpg', 4, 4, 15),
('StackPro Drawer Organizer', 'Adjustable drawer organizers ideal for kitchen utensils and cutlery.', 1699.00, 22, '/uploads/products/storage_home5.jpg', 4, 4, 15);



INSERT INTO items (item_name, item_desc, item_price, item_stock, item_image, vendor_id, category_id, item_type_id)
VALUES
('CozyNest Cotton Bedsheet', 'A soft 100% cotton bedsheet with a breathable weave for ultimate comfort.', 2999.00, 25, '/uploads/products/sheets_home1.jpg', 4, 4, 16),
('DreamWeave Printed Sheet', 'A vibrant printed bedsheet that adds color and charm to your bedroom.', 2799.00, 20, '/uploads/products/sheets_home2.jpg', 4, 4, 16),
('LuxeLayer Fitted Sheet', 'A smooth fitted bedsheet with deep pockets for a snug fit.', 3199.00, 18, '/uploads/products/sheets_home3.jpg', 4, 4, 16),
('BreezeSoft Double Bedsheet', 'A lightweight double bedsheet ideal for all seasons.', 2499.00, 22, '/uploads/products/sheets_home4.jpg', 4, 4, 16),
('RoyalRest King Size Sheet', 'A premium king size bedsheet crafted from high-thread count fabric.', 3499.00, 15, '/uploads/products/sheets_home5.jpg', 4, 4, 16);



UPDATE items
SET item_image = CASE
    WHEN item_name = 'Mystic Quest' THEN '/uploads/products/board_toy3.jpeg'
    WHEN item_name = 'City Builders' THEN '/uploads/products/board_toy4.jpeg'
    WHEN item_name = 'ChefMaster Knife Set' THEN '/uploads/products/kitchen_home1.jpeg'
    WHEN item_name = 'QuickBoil Electric Kettle' THEN '/uploads/products/kitchen_home3.jpeg'
    WHEN item_name = 'HomeBrew Coffee Maker' THEN '/uploads/products/kitchen_home4.jpeg'
    WHEN item_name = 'GrillMate Griddle' THEN '/uploads/products/cookware_home3.jpeg'
    WHEN item_name = 'ChefLine Saucepan Set' THEN '/uploads/products/cookware_home4.jpeg'
    WHEN item_name = 'BakersChoice Casserole Dish' THEN '/uploads/products/cookware_home5.jpeg'
    WHEN item_name = 'FlexiBin Storage Box' THEN '/uploads/products/storage_home2.jpeg'
    WHEN item_name = 'CozyNest Cotton Bedsheet' THEN '/uploads/products/sheets_home1.jpeg'
    WHEN item_name = 'DreamWeave Printed Sheet' THEN '/uploads/products/sheets_home2.jpeg'
    WHEN item_name = 'LuxeLayer Fitted Sheet' THEN '/uploads/products/sheets_home3.jpeg'
    ELSE item_image
END;


UPDATE items
SET item_image = '/uploads/products/board_toy3.png'
WHERE item_name = 'Mystic Quest';