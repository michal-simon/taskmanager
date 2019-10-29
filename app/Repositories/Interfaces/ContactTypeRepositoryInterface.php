<?php
namespace App\Repositories\Interfaces;
use App\ContactType;

interface ContactTypeRepositoryInterface {
    public function getAll();
    /**
     * 
     * @param int $id
     */
    public function findContactTypeById(int $id): ContactType;
}
