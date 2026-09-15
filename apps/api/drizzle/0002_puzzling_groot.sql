CREATE UNIQUE INDEX "units_name_unique" ON "units" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "units_symbol_unique" ON "units" USING btree ("symbol");