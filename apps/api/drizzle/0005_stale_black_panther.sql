CREATE TYPE "public"."stock_ledger_movement_type" AS ENUM('IN', 'OUT');--> statement-breakpoint
CREATE TYPE "public"."stock_ledger_reference_type" AS ENUM('GOODS_RECEIPT', 'STOCK_ISSUE', 'TRANSFER_OUT', 'TRANSFER_IN', 'ADJUSTMENT', 'RETURN_IN', 'RETURN_OUT', 'INTERNAL_MOVE');--> statement-breakpoint
CREATE TYPE "public"."stock_reservation_status" AS ENUM('ACTIVE', 'PARTIALLY_RELEASED', 'RELEASED');--> statement-breakpoint
CREATE TABLE "inventory_balances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"warehouse_id" uuid NOT NULL,
	"location_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"physical_qty" numeric(14, 2) DEFAULT '0' NOT NULL,
	"reserved_qty" numeric(14, 2) DEFAULT '0' NOT NULL,
	"damaged_qty" numeric(14, 2) DEFAULT '0' NOT NULL,
	"quarantine_qty" numeric(14, 2) DEFAULT '0' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "inventory_balances_physical_qty_check" CHECK ("inventory_balances"."physical_qty" >= 0),
	CONSTRAINT "inventory_balances_reserved_qty_check" CHECK ("inventory_balances"."reserved_qty" >= 0),
	CONSTRAINT "inventory_balances_damaged_qty_check" CHECK ("inventory_balances"."damaged_qty" >= 0),
	CONSTRAINT "inventory_balances_quarantine_qty_check" CHECK ("inventory_balances"."quarantine_qty" >= 0),
	CONSTRAINT "inventory_balances_reserved_not_above_physical_check" CHECK ("inventory_balances"."reserved_qty" <= "inventory_balances"."physical_qty"),
	CONSTRAINT "inventory_balances_damaged_not_above_physical_check" CHECK ("inventory_balances"."damaged_qty" <= "inventory_balances"."physical_qty"),
	CONSTRAINT "inventory_balances_quarantine_not_above_physical_check" CHECK ("inventory_balances"."quarantine_qty" <= "inventory_balances"."physical_qty")
);
--> statement-breakpoint
CREATE TABLE "inventory_costs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"warehouse_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"quantity" numeric(14, 2) DEFAULT '0' NOT NULL,
	"average_unit_cost" numeric(14, 2) DEFAULT '0' NOT NULL,
	"total_value" numeric(18, 2) DEFAULT '0' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "inventory_costs_quantity_check" CHECK ("inventory_costs"."quantity" >= 0),
	CONSTRAINT "inventory_costs_average_unit_cost_check" CHECK ("inventory_costs"."average_unit_cost" >= 0),
	CONSTRAINT "inventory_costs_total_value_check" CHECK ("inventory_costs"."total_value" >= 0)
);
--> statement-breakpoint
CREATE TABLE "stock_ledger" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"transaction_number" uuid DEFAULT gen_random_uuid() NOT NULL,
	"reference_type" "stock_ledger_reference_type" NOT NULL,
	"reference_id" uuid NOT NULL,
	"movement_type" "stock_ledger_movement_type" NOT NULL,
	"warehouse_id" uuid NOT NULL,
	"location_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"quantity" numeric(14, 2) NOT NULL,
	"unit_cost" numeric(14, 2) NOT NULL,
	"total_cost" numeric(18, 2) NOT NULL,
	"balance_before" numeric(14, 2) NOT NULL,
	"balance_after" numeric(14, 2) NOT NULL,
	"average_cost_before" numeric(14, 2) NOT NULL,
	"average_cost_after" numeric(14, 2) NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stock_reservations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"warehouse_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"reference_type" text NOT NULL,
	"reference_id" uuid NOT NULL,
	"reserved_qty" numeric(14, 2) NOT NULL,
	"released_qty" numeric(14, 2) DEFAULT '0' NOT NULL,
	"status" "stock_reservation_status" DEFAULT 'ACTIVE' NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "inventory_balances" ADD CONSTRAINT "inventory_balances_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_balances" ADD CONSTRAINT "inventory_balances_location_id_warehouse_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."warehouse_locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_balances" ADD CONSTRAINT "inventory_balances_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_costs" ADD CONSTRAINT "inventory_costs_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_costs" ADD CONSTRAINT "inventory_costs_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_ledger" ADD CONSTRAINT "stock_ledger_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_ledger" ADD CONSTRAINT "stock_ledger_location_id_warehouse_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."warehouse_locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_ledger" ADD CONSTRAINT "stock_ledger_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_ledger" ADD CONSTRAINT "stock_ledger_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_reservations" ADD CONSTRAINT "stock_reservations_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_reservations" ADD CONSTRAINT "stock_reservations_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_reservations" ADD CONSTRAINT "stock_reservations_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "inventory_balances_warehouse_location_product_unique" ON "inventory_balances" USING btree ("warehouse_id","location_id","product_id");--> statement-breakpoint
CREATE INDEX "inventory_balances_warehouse_id_idx" ON "inventory_balances" USING btree ("warehouse_id");--> statement-breakpoint
CREATE INDEX "inventory_balances_location_id_idx" ON "inventory_balances" USING btree ("location_id");--> statement-breakpoint
CREATE INDEX "inventory_balances_product_id_idx" ON "inventory_balances" USING btree ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "inventory_costs_warehouse_product_unique" ON "inventory_costs" USING btree ("warehouse_id","product_id");--> statement-breakpoint
CREATE INDEX "inventory_costs_warehouse_id_idx" ON "inventory_costs" USING btree ("warehouse_id");--> statement-breakpoint
CREATE INDEX "inventory_costs_product_id_idx" ON "inventory_costs" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "stock_ledger_transaction_number_idx" ON "stock_ledger" USING btree ("transaction_number");--> statement-breakpoint
CREATE INDEX "stock_ledger_reference_idx" ON "stock_ledger" USING btree ("reference_type","reference_id");--> statement-breakpoint
CREATE INDEX "stock_ledger_warehouse_id_idx" ON "stock_ledger" USING btree ("warehouse_id");--> statement-breakpoint
CREATE INDEX "stock_ledger_location_id_idx" ON "stock_ledger" USING btree ("location_id");--> statement-breakpoint
CREATE INDEX "stock_ledger_product_id_idx" ON "stock_ledger" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "stock_ledger_created_at_idx" ON "stock_ledger" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "stock_reservations_warehouse_id_idx" ON "stock_reservations" USING btree ("warehouse_id");--> statement-breakpoint
CREATE INDEX "stock_reservations_product_id_idx" ON "stock_reservations" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "stock_reservations_reference_idx" ON "stock_reservations" USING btree ("reference_type","reference_id");--> statement-breakpoint
CREATE INDEX "stock_reservations_status_idx" ON "stock_reservations" USING btree ("status");