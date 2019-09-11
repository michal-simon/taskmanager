<?php
namespace App\Repositories\Interfaces;

use App\Project;
use Illuminate\Support\Collection;

interface ProjectRepositoryInterface
{
    public function createProject(array $data): Project;
    public function findProjectById(int $id) : Project;
    public function updateProject(array $data) : bool;
    public function deleteProject() : bool;
    public function listProjects($columns = array('*'), string $orderBy = 'id', string $sortBy = 'asc') : Collection;
}