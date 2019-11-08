<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnsInvoiceLines extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::table('invoice_lines', function (Blueprint $table) {
            $table->decimal('unit_discount', 8, 2);
            $table->decimal('unit_tax', 8, 2);
            $table->decimal('tax_total', 8, 2);
            $table->decimal('sub_total', 8, 2);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        //
    }

}
