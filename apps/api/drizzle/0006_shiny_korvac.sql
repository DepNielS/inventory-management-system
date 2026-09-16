ALTER TABLE "stock_ledger" ADD CONSTRAINT "stock_ledger_quantity_check" CHECK ("stock_ledger"."quantity" > 0);--> statement-breakpoint
ALTER TABLE "stock_ledger" ADD CONSTRAINT "stock_ledger_unit_cost_check" CHECK ("stock_ledger"."unit_cost" >= 0);--> statement-breakpoint
ALTER TABLE "stock_ledger" ADD CONSTRAINT "stock_ledger_total_cost_check" CHECK ("stock_ledger"."total_cost" >= 0);--> statement-breakpoint
ALTER TABLE "stock_ledger" ADD CONSTRAINT "stock_ledger_balance_before_check" CHECK ("stock_ledger"."balance_before" >= 0);--> statement-breakpoint
ALTER TABLE "stock_ledger" ADD CONSTRAINT "stock_ledger_balance_after_check" CHECK ("stock_ledger"."balance_after" >= 0);--> statement-breakpoint
ALTER TABLE "stock_ledger" ADD CONSTRAINT "stock_ledger_average_cost_before_check" CHECK ("stock_ledger"."average_cost_before" >= 0);--> statement-breakpoint
ALTER TABLE "stock_ledger" ADD CONSTRAINT "stock_ledger_average_cost_after_check" CHECK ("stock_ledger"."average_cost_after" >= 0);--> statement-breakpoint
ALTER TABLE "stock_reservations" ADD CONSTRAINT "stock_reservations_reserved_qty_check" CHECK ("stock_reservations"."reserved_qty" > 0);--> statement-breakpoint
ALTER TABLE "stock_reservations" ADD CONSTRAINT "stock_reservations_released_qty_check" CHECK ("stock_reservations"."released_qty" >= 0);--> statement-breakpoint
ALTER TABLE "stock_reservations" ADD CONSTRAINT "stock_reservations_released_not_above_reserved_check" CHECK ("stock_reservations"."released_qty" <= "stock_reservations"."reserved_qty");