<?php
namespace App\Repositories;
use App\Repositories\Base\BaseRepository;
use App\TaxRate;
use App\Repositories\Interfaces\TaxRateRepositoryInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Support\Collection;
class TaxRateRepository extends BaseRepository implements TaxRateRepositoryInterface
{
    /**
     * TaxRate constructor.
     * @param TaxRate $courier
     */
    public function __construct(TaxRate $taxRate)
    {
        parent::__construct($taxRate);
        $this->model = $taxRate;
    }
    /**
     * Create the tax rate
     *
     * @param array $params
     * @return TaxRate
     * @throws CourierInvalidArgumentException
     */
    public function createTaxRate(array $params) : TaxRate
    {
       
        return $this->create($params);
       
    }
    /**
     * Update the courier
     *
     * @param array $params
     *
     * @return bool
     * @throws CourierInvalidArgumentException
     */
    public function updateTaxRate(array $params) : bool
    {
       
        return $this->update($params);
        
    }
    /**
     * Return the courier
     *
     * @param int $id
     *
     * @return TaxRate
     * @throws CourierNotFoundException
     */
    public function findTaxRateById(int $id) : TaxRate
    {
       
        return $this->findOneOrFail($id);
        
    }
    /**
     * Return all the tax rates
     *
     * @param string $order
     * @param string $sort
     * @return Collection|mixed
     */
    public function listTaxRates(string $order = 'id', string $sort = 'desc') : Collection
    {
        return $this->all(['*'], $order, $sort);
    }
    /**
     * @return bool
     * @throws \Exception
     */
    public function deleteTaxRate() {
        return $this->delete();
    }
    
     /**
     * @param string $text
     * @return mixed
     */
    public function searchTaxRate(string $text = null): Collection {
        if (is_null($text)) {
            return $this->all();
        }
        return $this->model->searchTaxRate($text)->get();
    }
}
