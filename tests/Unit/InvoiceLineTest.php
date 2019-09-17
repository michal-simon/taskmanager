<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\InvoiceLine;
use App\Invoice;
use App\Repositories\InvoiceRepository;
use App\Repositories\InvoiceLineRepository;
use Illuminate\Support\Collection;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class InvoiceLineTest extends TestCase {

    use DatabaseTransactions;

    private $invoice;

    public function setUp() {
        parent::setUp();
        $this->beginDatabaseTransaction();
        $this->invoice = factory(Invoice::class)->create();
    }

    /** @test */
    public function it_can_delete_the_invoice_line() {
        $invoiceLine = factory(InvoiceLine::class)->create();
        $invoiceLineRepo = new InvoiceLineRepository($invoiceLine);
        $deleted = $invoiceLineRepo->deleteLine($invoiceLine->id);
        $this->assertTrue($deleted);
    }

    /** @test */
    public function it_can_show_the_invoice_line() {
        $invoiceLine = factory(InvoiceLine::class)->create();
        $invoiceLineRepo = new InvoiceLineRepository(new InvoiceLine);
        $found = $invoiceLineRepo->findLineById($invoiceLine->id);
        $this->assertInstanceOf(InvoiceLine::class, $found);
        $this->assertEquals($invoiceLine->quantity, $found->quantity);
    }

    /** @test */
    public function it_can_create_a_invoice_line() {

        $data = [
            'invoice_id' => $this->invoice->id,
            'quantity' => 20,
            'description' => 'Test',
            'unit_price' => 20,
        ];

        $invoiceRepo = new InvoiceRepository(new Invoice);
        $invoice = $invoiceRepo->findInvoiceById($this->invoice->id);


        $invoiceLineRepo = new InvoiceLineRepository(new InvoiceLine);
        $invoiceLine = $invoiceLineRepo->createInvoiceLine($invoice, $data);
        $this->assertInstanceOf(InvoiceLine::class, $invoiceLine);
        $this->assertEquals($data['quantity'], $invoiceLine->quantity);
    }

    public function tearDown() {
        parent::tearDown();
    }

}
