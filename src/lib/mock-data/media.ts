/**
 * Site + product imagery. Hero / About keep the original brand frames;
 * everywhere else uses distinct modern fabric / fashion photos.
 */

const q = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const SITE_IMAGES = {
  // Original banner frames (intentionally restored)
  heroBg: q("photo-1490481651871-ab68de25d43d", 1600),
  heroLeft: q("photo-1495121605193-b116b5b9c5fe", 900),
  heroRight: q("photo-1483985988355-763728e1935b", 900),
  // Original About image (same frame as hero right, as before)
  about: q("photo-1483985988355-763728e1935b", 1600),
  auth: q("photo-1441986300917-64674bd600d8", 1600),
  promoSpring: q("photo-1558769132-cb1aea458c5e"),
  promoSale: q("photo-1445205170230-053b83016050"),
  promoAccessories: q("photo-1492707892479-7bc8d5a4ee93"),
  promoShoes: q("photo-1460353581641-37baddab0fa2"),
  // Smart / polished fashion — coat & tailored looks
  catWomen: q("photo-1515886657613-9f3515b0c78f"),
  catMen: q("photo-1552374196-1ab2a1c593e8"),
  catAccessories: q("photo-1523275335684-37898b6baf30"),
  catShoes: q("photo-1543163521-1bf539c55dd2"),
  catHome: q("photo-1616486338812-3dadae4b4ace"),
  catBeauty: q("photo-1596462502278-27bfdc403348"),
} as const;

/** Product galleries — each product gets exclusive fabric / apparel frames. */
export const PRODUCT_IMAGES = {
  "p-001": [
    q("photo-1539109136881-3be0616acf4b"),
    q("photo-1544022613-e87ca75a784a"),
    q("photo-1487222477894-8943e31ef7b2"),
    q("photo-1551028719-00167b16eac5"),
  ],
  "p-002": [
    q("photo-1614252369475-531eba835eb1"),
    q("photo-1531310197839-ccf54634509e"),
    q("photo-1582897085656-c636d006a246"),
  ],
  "p-003": [
    q("photo-1620799140408-edc6dcb6d633"),
    q("photo-1434389677669-e08b4cac3105"),
    q("photo-1576566588028-4147f3842f27"),
  ],
  "p-004": [
    q("photo-1548036328-c9fa89d128fa"),
    q("photo-1584917865442-de89df76afd3"),
    q("photo-1590874103328-eac38a683ce7"),
  ],
  "p-005": [
    q("photo-1602810318383-e386cc2a3ccf"),
    q("photo-1596755094514-f87e34085b2c"),
    q("photo-1622445275576-7217896cb7a8"),
  ],
  "p-006": [
    q("photo-1572635196237-14b3f281503f"),
    q("photo-1511499767150-a48a237ac008"),
  ],
  "p-007": [
    q("photo-1496747611176-843222e1e57c"),
    q("photo-1509631179647-0177331693ae"),
    q("photo-1566174053879-31528523f8ae"),
  ],
  "p-008": [
    q("photo-1603808033192-082d6919d3e1"),
    q("photo-1605733513597-a8f8341084e6"),
  ],
  "p-009": [
    q("photo-1521572163474-6864f9cf17ab"),
    q("photo-1618354691373-d851c5c3a990"),
    q("photo-1583743814966-8936f5b7be1a"),
  ],
  "p-010": [
    q("photo-1610701596007-11502861dcfa"),
    q("photo-1578749556568-bc2c40e68b61"),
  ],
  "p-011": [
    q("photo-1630019852942-f89202989a59"),
    q("photo-1611652022419-a9419f74343d"),
  ],
  "p-012": [
    q("photo-1544923246-77387bec3e16"),
    q("photo-1547949003-9792a18a2601"),
    q("photo-1489987707025-020f04d379a6"),
  ],
} as const;
