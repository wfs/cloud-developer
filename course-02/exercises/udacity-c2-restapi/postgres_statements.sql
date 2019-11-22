DROP VIEW IF EXISTS joined;
DROP VIEW IF EXISTS toyotas;
DROP TABLE IF EXISTS "public"."make";
DROP TABLE IF EXISTS "public"."cars";
-- *****
SELECT * FROM "public"."User";

TRUNCATE "public"."User";

-- *****

SELECT * FROM "FeedItem";

UPDATE "FeedItem" SET "url" = 'rally_mud.png' WHERE "FeedItem"."id" = 2;

UPDATE "FeedItem" SET "url" = 'waving_hi.png' WHERE "FeedItem"."id" = 1;

-- *****