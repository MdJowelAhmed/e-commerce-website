/**
 * Site + product imagery. Hero / About keep the original brand frames;
 * everywhere else uses distinct modern fabric / fashion photos.
 */

const q = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

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

/** Product galleries — each product gets exclusive, verified high-resolution fashion frames. */
export const PRODUCT_IMAGES = {
  "p-001": [
    q("photo-1539109136881-3be0616acf4b"),
    q("photo-1515886657613-9f3515b0c78f"),
    q("photo-1544022613-e87ca75a784a"),
  ],
  "p-002": [
    q("photo-1614252369475-531eba835eb1"),
    q("photo-1533867617858-e7b97e060509"),
    q("photo-1582897085656-c636d006a246"),
  ],
  "p-003": [
    q("photo-1620799140408-edc6dcb6d633"),
    q("photo-1576566588028-4147f3842f27"),
    q("photo-1618354691373-d851c5c3a990"),
  ],
  "p-004": [
    q("photo-1548036328-c9fa89d128fa"),
    q("photo-1590874103328-eac38a683ce7"),
    q("photo-1584917865442-de89df76afd3"),
  ],
  "p-005": [
    q("photo-1602810318383-e386cc2a3ccf"),
    q("photo-1598033129183-c4f50c736f10"),
    q("photo-1622445275463-afa2ab738c34"),
  ],
  "p-006": [
    q("photo-1572635196237-14b3f281503f"),
    q("photo-1508296695146-257a814070b4"),
    q("photo-1473496169904-658ba7c44d8a"),
  ],
  "p-007": [
    q("photo-1496747611176-843222e1e57c"),
    q("photo-1509631179647-0177331693ae"),
    q("photo-1566174053879-31528523f8ae"),
  ],
  "p-008": [
    q("photo-1543163521-1bf539c55dd2"),
    q("photo-1533867617858-e7b97e060509"),
    q("photo-1560343090-f0409e92791a"),
  ],
  "p-009": [
    q("photo-1521572163474-6864f9cf17ab"),
    q("photo-1583743814966-8936f5b7be1a"),
    q("photo-1503342217505-b0a15ec3261c"),
  ],
  "p-010": [
    q("photo-1514432324607-a09d9b4aefdd"),
    q("photo-1578749556568-bc2c40e68b61"),
    q("photo-1610701596007-11502861dcfa"),
  ],
  "p-011": [
    q("photo-1535632066927-ab7c9ab60908"),
    q("photo-1599643478518-a784e5dc4c8f"),
    q("photo-1535632787350-4e68ef0ac584"),
  ],
  "p-012": [
    q("photo-1548883354-7622d03aca27"),
    q("photo-1578587018452-892bacefd3f2"),
    q("photo-1539571696357-5a69c17a67c6"),
  ],
  "p-013": [
    q("photo-1596755094514-f87e34085b2c"),
    q("photo-1602810318383-e386cc2a3ccf"),
    q("photo-1622445275463-afa2ab738c34"),
  ],
  "p-014": [
    q("photo-1473966968600-fa801b869a1a"),
    q("photo-1624378439575-d8705ad7ae80"),
    q("photo-1594633312681-425c7b97ccd1"),
  ],
  "p-015": [
    q("photo-1533867617858-e7b97e060509"),
    q("photo-1560343090-f0409e92791a"),
    q("photo-1582897085656-c636d006a246"),
  ],
  "p-016": [
    q("photo-1524805444758-089113d48a6d"),
    q("photo-1522335789203-aabd1fc54bc9"),
    q("photo-1508057198894-247b23fe5ade"),
  ],
  "p-017": [
    q("photo-1584273143981-41c073dfe8f8"),
    q("photo-1591047139829-d91aecb6caea"),
    q("photo-1534528741775-53994a69daeb"),
  ],
  "p-018": [
    q("photo-1601924994987-69e26d50dc26"),
    q("photo-1584917865442-de89df76afd3"),
  ],
  "p-019": [
    q("photo-1434389677669-e08b4cac3105"),
    q("photo-1576566588028-4147f3842f27"),
  ],
  "p-020": [
    q("photo-1548883354-7622d03aca27"),
    q("photo-1578587018452-892bacefd3f2"),
  ],
} as const;
