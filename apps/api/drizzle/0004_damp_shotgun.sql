CREATE TYPE "public"."sales_order_status" AS ENUM('DRAFT', 'SUBMITTED', 'APPROVED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."stock_issue_status" AS ENUM('DRAFT', 'POSTED', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TABLE "sales_order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sales_order_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"ordered_qty" numeric(14, 2) NOT NULL,
	"unit_price" numeric(14, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sales_order_items_ordered_qty_check" CHECK ("sales_order_items"."ordered_qty" > 0),
	CONSTRAINT "sales_order_items_unit_price_check" CHECK ("sales_order_items"."unit_price" >= 0)
);
--> statement-breakpoint
CREATE TABLE "sales_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"so_number" text NOT NULL,
	"customer_id" uuid NOT NULL,
	"warehouse_id" uuid NOT NULL,
	"order_date" date NOT NULL,
	"requested_date" date,
	"status" "sales_order_status" DEFAULT 'DRAFT' NOT NULL,
	"notes" text,
	"created_by" uuid NOT NULL,
	"approved_by" uuid,
	"approved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stock_issue_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stock_issue_id" uuid NOT NULL,
	"sales_order_item_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"location_id" uuid NOT NULL,
	"issued_qty" numeric(14, 2) NOT NULL,
	"unit_cost" numeric(14, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "stock_issue_items_issued_qty_check" CHECK ("stock_issue_items"."issued_qty" > 0),
	CONSTRAINT "stock_issue_items_unit_cost_check" CHECK ("stock_issue_items"."unit_cost" >= 0)
);
--> statement-breakpoint
CREATE TABLE "stock_issues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"issue_number" text NOT NULL,
	"sales_order_id" uuid NOT NULL,
	"issue_date" date NOT NULL,
	"status" "stock_issue_status" DEFAULT 'DRAFT' NOT NULL,
	"notes" text,
	"created_by" uuid NOT NULL,
	"posted_by" uuid,
	"posted_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sales_order_items" ADD CONSTRAINT "sales_order_items_sales_order_id_sales_orders_id_fk" FOREIGN KEY ("sales_order_id") REFERENCES "public"."sales_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_order_items" ADD CONSTRAINT "sales_order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_orders" ADD CONSTRAINT "sales_orders_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_orders" ADD CONSTRAINT "sales_orders_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_orders" ADD CONSTRAINT "sales_orders_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_orders" ADD CONSTRAINT "sales_orders_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_issue_items" ADD CONSTRAINT "stock_issue_items_stock_issue_id_stock_issues_id_fk" FOREIGN KEY ("stock_issue_id") REFERENCES "public"."stock_issues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_issue_items" ADD CONSTRAINT "stock_issue_items_sales_order_item_id_sales_order_items_id_fk" FOREIGN KEY ("sales_order_item_id") REFERENCES "public"."sales_order_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_issue_items" ADD CONSTRAINT "stock_issue_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_issue_items" ADD CONSTRAINT "stock_issue_items_location_id_warehouse_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."warehouse_locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_issues" ADD CONSTRAINT "stock_issues_sales_order_id_sales_orders_id_fk" FOREIGN KEY ("sales_order_id") REFERENCES "public"."sales_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_issues" ADD CONSTRAINT "stock_issues_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_issues" ADD CONSTRAINT "stock_issues_posted_by_users_id_fk" FOREIGN KEY ("posted_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "sales_order_items_sales_order_id_idx" ON "sales_order_items" USING btree ("sales_order_id");--> statement-breakpoint
CREATE INDEX "sales_order_items_product_id_idx" ON "sales_order_items" USING btree ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sales_orders_so_number_unique" ON "sales_orders" USING btree ("so_number");--> statement-breakpoint
CREATE INDEX "sales_orders_customer_id_idx" ON "sales_orders" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "sales_orders_warehouse_id_idx" ON "sales_orders" USING btree ("warehouse_id");--> statement-breakpoint
CREATE INDEX "sales_orders_status_idx" ON "sales_orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "sales_orders_order_date_idx" ON "sales_orders" USING btree ("order_date");--> statement-breakpoint
CREATE INDEX "sales_orders_created_by_idx" ON "sales_orders" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "sales_orders_approved_by_idx" ON "sales_orders" USING btree ("approved_by");--> statement-breakpoint
CREATE INDEX "stock_issue_items_stock_issue_id_idx" ON "stock_issue_items" USING btree ("stock_issue_id");--> statement-breakpoint
CREATE INDEX "stock_issue_items_sales_order_item_id_idx" ON "stock_issue_items" USING btree ("sales_order_item_id");--> statement-breakpoint
CREATE INDEX "stock_issue_items_product_id_idx" ON "stock_issue_items" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "stock_issue_items_location_id_idx" ON "stock_issue_items" USING btree ("location_id");--> statement-breakpoint
CREATE UNIQUE INDEX "stock_issues_issue_number_unique" ON "stock_issues" USING btree ("issue_number");--> statement-breakpoint
CREATE INDEX "stock_issues_sales_order_id_idx" ON "stock_issues" USING btree ("sales_order_id");--> statement-breakpoint
CREATE INDEX "stock_issues_status_idx" ON "stock_issues" USING btree ("status");--> statement-breakpoint
CREATE INDEX "stock_issues_issue_date_idx" ON "stock_issues" USING btree ("issue_date");--> statement-breakpoint
CREATE INDEX "stock_issues_created_by_idx" ON "stock_issues" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "stock_issues_posted_by_idx" ON "stock_issues" USING btree ("posted_by");