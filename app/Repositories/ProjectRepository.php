<?php
namespace App\Repositories;

use App\Project;
use App\Repositories\Interfaces\ProjectRepositoryInterface;
use App\Repositories\Base\BaseRepository;
use App\Exceptions\CreateProjectErrorException;
use Illuminate\Support\Collection;

class ProjectRepository extends BaseRepository implements ProjectRepositoryInterface
{

    /**
     * ProjectRepository constructor.
     *
     * @param Project $project
     */
    public function __construct(Project $project)
    {
        parent::__construct($project);
        $this->model = $project;
    }

    /**
    * @param array $data
    *
    * @return Project
    * @throws CreateProjectErrorException
    */
    public function createProject(array $data) : Project
    {
        try {
            return $this->create($data);
        } catch (QueryException $e) {
            throw new CreateProjectErrorException($e);
        }
    }

    /**
     * @param int $id
     *
     * @return Project
     * @throws \Exception
     */
    public function findProjectById(int $id) : Project
    {
        return $this->findOneOrFail($id);
    }

    /**
     * @param array $data
     * @param int $id
     *
     * @return bool
     * @throws \Exception
     */
    public function updateProject(array $data) : bool
    {
        return $this->update($data);
    }

    /**
     * @return bool
     * @throws \Exception
     */
    public function deleteProject() : bool
    {
        return $this->delete();
    }

    /**
     * @param array $columns
     * @param string $orderBy
     * @param string $sortBy
     *
     * @return Collection
     */
    public function listProjects($columns = array('*'), string $orderBy = 'id', string $sortBy = 'asc') : Collection
    {
        return $this->all($columns, $orderBy, $sortBy);
    }
}