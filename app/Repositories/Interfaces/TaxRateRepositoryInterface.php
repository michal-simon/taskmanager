<?php
namespace App\Repositories\Interfaces;
use App\Repositories\Base\BaseRepositoryInterface;
use App\TaxRate;
use Illuminate\Support\Collection;
interface TaxRateRepositoryInterface extends BaseRepositoryInterface
{
    public function createTaxRate(array $data) : TaxRate;
    public function updateTaxRate(array $params) : bool;
    public function findTaxRateById(int $id) : TaxRate;
    public function listTaxRates(string $order = 'id', string $sort = 'desc') : Collection;
    public function deleteTaxRate();
}
