<?php
namespace Tests\Unit;
use App\TaxRate;
use App\Repositories\TaxRateRepository;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use App\Transformations\EventTransformable;
use Illuminate\Foundation\Testing\WithFaker;

class TaxRateUnitTest extends TestCase {
    
use DatabaseTransactions,
        EventTransformable,
        WithFaker;
    
public function setUp() : void {
        parent::setUp();
        $this->beginDatabaseTransaction();
    }

    /** @test */
    public function it_can_list_all_the_tax_rates()
    {
        $data = [
            'name' => $this->faker->word,
            'rate' => $this->faker->randomFloat()
        ];

        $taxRateRepo = new TaxRateRepository(new TaxRate);
        $taxRateRepo->createTaxRate($data);
        $lists = $taxRateRepo->listTaxRates();
        foreach ($lists as $list) {
            $this->assertDatabaseHas('tax_rates', ['name' => $list->name]);
            $this->assertDatabaseHas('tax_rates', ['rate' => $list->rate]);
        }
    }
    
    /** @test */
    public function it_errors_when_the_tax_rate_is_not_found()
    {
        $this->expectException(CourierNotFoundException::class);
        $this->expectExceptionMessage('Courier not found.');
        $taxRateRepo = new TaxRateRepository(new TaxRate);
        $taxRateRepo->findTaxRateById(999);
    }
    
    /** @test */
    public function it_can_get_the_tax_rate()
    {
        $data = [
            'name' => $this->faker->word,
            'rate' => $this->faker->randomFloat()
        ];

        $taxRateRepo = new TaxRateRepository(new TaxRate);
        $created = $taxRateRepo->createTaxRate($data);
        $found = $taxRateRepo->findTaxRateById($created->id);
        $this->assertEquals($data['name'], $found->name);
        $this->assertEquals($data['rate'], $found->rate);
    }
    
    /** @test */
    public function it_errors_updating_the_tax_rate()
    {
        $this->expectException(CourierInvalidArgumentException::class);
        $taxRate = factory(TaxRate::class)->create();
        $taxRateRepo = new TaxRateRepository($taxRate);
        $taxRateRepo->updateTaxRate(['name' => null]);
    }
    
    /** @test */
    public function it_can_update_the_tax_rate()
    {
        $taxRate = factory(TaxRate::class)->create();
        $taxRateRepo = new TaxRateRepository($taxRate);
        $update = [
            'name' => $this->faker->word,
            'rate' => $this->faker->randomFloat(),
        ];
        $updated = $taxRateRepo->updateTaxRate($update);
        $this->assertTrue($updated);
        $this->assertEquals($update['name'], $taxRate->name);
        $this->assertEquals($update['rate'], $taxRate->rate);
        
    }
    
    /** @test */
    public function it_errors_when_creating_the_tax_rate()
    {
        $this->expectException(CourierInvalidArgumentException::class);
        $taxRateRepo = new TaxRateRepository(new TaxRate);
        $taxRateRepo->createTaxRate([]);
    }
    
    /** @test */
    public function it_can_create_a_tax_rate()
    {
        $data = [
            'name' => $this->faker->word,
            'rate' => $this->faker->randomFloat(),
        ];
        $taxRateRepo = new TaxRateRepository(new TaxRate);
        $created = $taxRateRepo->createTaxRate($data);
        $this->assertEquals($data['name'], $created->name);
        $this->assertEquals($data['rate'], $created->rate);
    }
}
