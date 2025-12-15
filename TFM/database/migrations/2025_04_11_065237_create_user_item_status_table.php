<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('user_item_status', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id');
            $table->unsignedBigInteger('item_id');
            $table->string('item_type');
            $table->string('status');
            $table->timestamps();
        
            $table->unique(['user_id', 'item_id', 'item_type', 'status']);
        
            $table->foreign('user_id')
                  ->references('id_usuari')->on('usuaris')
                  ->onUpdate('cascade')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_item_status');
    }
};

