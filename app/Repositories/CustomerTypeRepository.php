<?php
namespace App\Repositories;
use App\ContactType;
use App\Repositories\Interfaces\ContactTypeRepositoryInterface;
use App\Repositories\Base\BaseRepository;

class CustomerTypeRepository extends BaseRepository implements ContactTypeRepositoryInterface {
    
    /**
     * ContactTypeRepository constructor.
     *
     * @param ContactType $contactType
     */
    public function __construct(ContactType $contactType) {
        parent::__construct($contactType);
        $this->model = $contactType;
    }
    public function getAll() {
        return $this->model->orderBy('name', 'asc')
                        ->get();
    }
    
    /**
     * @param int $id
     *
     * @return ContactType
     * @throws \Exception
     */
    public function findContactType(int $id): ContactType {
        return $this->findOneOrFail($id);
    }
}
