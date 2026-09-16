CREATE TYPE "public"."customer_return_condition" AS ENUM('AVAILABLE', 'DAMAGED', 'QUARANTINE');--> statement-breakpoint
CREATE TYPE "public"."customer_return_status" AS ENUM('DRAFT', 'SUBMITTED', 'APPROVED', 'POSTED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."purchase_return_status" AS ENUM('DRAFT', 'SUBMITTED', 'APPROVED', 'POSTED', 'CANCELLED');--> statement-breakpoint
CREATE TABLE "customer_return_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_return_id" uuid NOT NULL,
	"sales_order_item_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"location_id" uuid NOT NULL,
	"returned_qty" numeric(14, 2) NOT NULL,
	"unit_cost" numeric(14, 2) DEFAULT '0' NOT NULL,
	"condition" "customer_return_condition" DEFAULT 'AVAILABLE' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "customer_return_items_returned_qty_check" CHECK ("customer_return_items"."returned_qty" > 0),
	CONSTRAINT "customer_return_items_unit_cost_check" CHECK ("customer_return_items"."unit_cost" >= 0)
);
--> statement-breakpoint
CREATE TABLE "customer_returns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"return_number" text NOT NULL,
	"customer_id" uuid NOT NULL,
	"warehouse_id" uuid NOT NULL,
	"sales_order_id" uuid NOT NULL,
	"return_date" date NOT NULL,
	"status" "customer_return_status" DEFAULT 'DRAFT' NOT NULL,
	"reason" text NOT NULL,
	"notes" text,
	"created_by" uuid NOT NULL,
	"approved_by" uuid,
	"approved_at" timestamp with time zone,
	"posted_by" uuid,
	"posted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchase_return_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"purchase_return_id" uuid NOT NULL,
	"goods_receipt_item_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"location_id" uuid NOT NULL,
	"returned_qty" numeric(14, 2) NOT NULL,
	"unit_cost" numeric(14, 2) DEFAULT '0' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "purchase_return_items_returned_qty_check" CHECK ("purchase_return_items"."returned_qty" > 0),
	CONSTRAINT "purchase_return_items_unit_cost_check" CHECK ("purchase_return_items"."unit_cost" >= 0)
);
--> statement-breakpoint
CREATE TABLE "purchase_returns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"return_number" text NOT NULL,
	"supplier_id" uuid NOT NULL,
	"warehouse_id" uuid NOT NULL,
	"goods_receipt_id" uuid NOT NULL,
	"return_date" date NOT NULL,
	"status" "purchase_return_status" DEFAULT 'DRAFT' NOT NULL,
	"reason" text NOT NULL,
	"notes" text,
	"created_by" uuid NOT NULL,
	"approved_by" uuid,
	"approved_at" timestamp with time zone,
	"posted_by" uuid,
	"posted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "customer_return_items" ADD CONSTRAINT "customer_return_items_customer_return_id_customer_returns_id_fk" FOREIGN KEY ("customer_return_id") REFERENCES "public"."customer_returns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_return_items" ADD CONSTRAINT "customer_return_items_sales_order_item_id_sales_order_items_id_fk" FOREIGN KEY ("sales_order_item_id") REFERENCES "public"."sales_order_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_return_items" ADD CONSTRAINT "customer_return_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_return_items" ADD CONSTRAINT "customer_return_items_location_id_warehouse_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."warehouse_locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_returns" ADD CONSTRAINT "customer_returns_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_returns" ADD CONSTRAINT "customer_returns_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_returns" ADD CONSTRAINT "customer_returns_sales_order_id_sales_orders_id_fk" FOREIGN KEY ("sales_order_id") REFERENCES "public"."sales_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_returns" ADD CONSTRAINT "customer_returns_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_returns" ADD CONSTRAINT "customer_returns_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_returns" ADD CONSTRAINT "customer_returns_posted_by_users_id_fk" FOREIGN KEY ("posted_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_return_items" ADD CONSTRAINT "purchase_return_items_purchase_return_id_purchase_returns_id_fk" FOREIGN KEY ("purchase_return_id") REFERENCES "public"."purchase_returns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_return_items" ADD CONSTRAINT "purchase_return_items_goods_receipt_item_id_goods_receipt_items_id_fk" FOREIGN KEY ("goods_receipt_item_id") REFERENCES "public"."goods_receipt_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_return_items" ADD CONSTRAINT "purchase_return_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_return_items" ADD CONSTRAINT "purchase_return_items_location_id_warehouse_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."warehouse_locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_returns" ADD CONSTRAINT "purchase_returns_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_returns" ADD CONSTRAINT "purchase_returns_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_returns" ADD CONSTRAINT "purchase_returns_goods_receipt_id_goods_receipts_id_fk" FOREIGN KEY ("goods_receipt_id") REFERENCES "public"."goods_receipts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_returns" ADD CONSTRAINT "purchase_returns_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_returns" ADD CONSTRAINT "purchase_returns_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_returns" ADD CONSTRAINT "purchase_returns_posted_by_users_id_fk" FOREIGN KEY ("posted_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "customer_return_items_customer_return_id_idx" ON "customer_return_items" USING btree ("customer_return_id");--> statement-breakpoint
CREATE INDEX "customer_return_items_sales_order_item_id_idx" ON "customer_return_items" USING btree ("sales_order_item_id");--> statement-breakpoint
CREATE INDEX "customer_return_items_product_id_idx" ON "customer_return_items" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "customer_return_items_location_id_idx" ON "customer_return_items" USING btree ("location_id");--> statement-breakpoint
CREATE INDEX "customer_return_items_condition_idx" ON "customer_return_items" USING btree ("condition");--> statement-breakpoint
CREATE UNIQUE INDEX "customer_returns_return_number_unique" ON "customer_returns" USING btree ("return_number");--> statement-breakpoint
CREATE INDEX "customer_returns_customer_id_idx" ON "customer_returns" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "customer_returns_warehouse_id_idx" ON "customer_returns" USING btree ("warehouse_id");--> statement-breakpoint
CREATE INDEX "customer_returns_sales_order_id_idx" ON "customer_returns" USING btree ("sales_order_id");--> statement-breakpoint
CREATE INDEX "customer_returns_status_idx" ON "customer_returns" USING btree ("status");--> statement-breakpoint
CREATE INDEX "customer_returns_return_date_idx" ON "customer_returns" USING btree ("return_date");--> statement-breakpoint
CREATE INDEX "customer_returns_created_by_idx" ON "customer_returns" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "customer_returns_approved_by_idx" ON "customer_returns" USING btree ("approved_by");--> statement-breakpoint
CREATE INDEX "customer_returns_posted_by_idx" ON "customer_returns" USING btree ("posted_by");--> statement-breakpoint
CREATE INDEX "purchase_return_items_purchase_return_id_idx" ON "purchase_return_items" USING btree ("purchase_return_id");--> statement-breakpoint
CREATE INDEX "purchase_return_items_goods_receipt_item_id_idx" ON "purchase_return_items" USING btree ("goods_receipt_item_id");--> statement-breakpoint
CREATE INDEX "purchase_return_items_product_id_idx" ON "purchase_return_items" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "purchase_return_items_location_id_idx" ON "purchase_return_items" USING btree ("location_id");--> statement-breakpoint
CREATE UNIQUE INDEX "purchase_returns_return_number_unique" ON "purchase_returns" USING btree ("return_number");--> statement-breakpoint
CREATE INDEX "purchase_returns_supplier_id_idx" ON "purchase_returns" USING btree ("supplier_id");--> statement-breakpoint
CREATE INDEX "purchase_returns_warehouse_id_idx" ON "purchase_returns" USING btree ("warehouse_id");--> statement-breakpoint
CREATE INDEX "purchase_returns_goods_receipt_id_idx" ON "purchase_returns" USING btree ("goods_receipt_id");--> statement-breakpoint
CREATE INDEX "purchase_returns_status_idx" ON "purchase_returns" USING btree ("status");--> statement-breakpoint
CREATE INDEX "purchase_returns_return_date_idx" ON "purchase_returns" USING btree ("return_date");--> statement-breakpoint
CREATE INDEX "purchase_returns_created_by_idx" ON "purchase_returns" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "purchase_returns_approved_by_idx" ON "purchase_returns" USING btree ("approved_by");--> statement-breakpoint
CREATE INDEX "purchase_returns_posted_by_idx" ON "purchase_returns" USING btree ("posted_by");