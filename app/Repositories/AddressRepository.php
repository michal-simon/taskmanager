<?php

namespace App\Repositories;

use App\Address;
use Illuminate\Support\Collection;
use App\Repositories\Base\BaseRepository;
use App\Repositories\Interfaces\AddressRepositoryInterface;

class AddressRepository extends BaseRepository implements AddressRepositoryInterface {
    //use AddressTransformable;

    /**
     * AddressRepository constructor.
     * @param Address $address
     */
    public function __construct(Address $address) {
        parent::__construct($address);
        $this->model = $address;
    }

    /**
     * List all the address
     *
     * @param string $order
     * @param string $sort
     * @param array $columns
     * @return array|Collection
     */
    public function listAddress(string $order = 'id', string $sort = 'desc', array $columns = ['*']): Collection {
        return $this->all($columns, $order, $sort);
    }

    /**
     * @param array $data
     * @return bool
     */
    public function updateAddress(array $data): bool {
        return $this->update($data);
    }

    /**
     * Delete the address
     *
     */
    public function deleteAddress() {
        return $this->model->delete();
    }

    /**
     * Return the address
     *
     * @param int $id
     *
     * @return Address
     * @throws AddressNotFoundException
     */
    public function findAddressById(int $id): Address {
        return $this->findOneOrFail($id);
    }
}
