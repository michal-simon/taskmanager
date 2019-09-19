<?php

namespace App\Http\Controllers;

use App\Project;
use App\Repositories\Interfaces\ProjectRepositoryInterface;
use App\Requests\CreateProjectRequest;

class ProjectController extends Controller {

    private $projectRepository;

    /**
     * 
     * @param ProjectRepositoryInterface $projectRepository
     */
    public function __construct(ProjectRepositoryInterface $projectRepository) {
        $this->projectRepository = $projectRepository;
    }

    public function index() {
        $projects = $this->projectRepository->listProjects(['*'], 'created_at', 'desc');

        return $projects->toJson();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store(CreateProjectRequest $request) {

        $validatedData = $request->validated();
        
        $project = Project::create([
                    'title' => $validatedData['title'],
                    'description' => $validatedData['description'],
                    'created_by' => $validatedData['created_by'],
                    'customer_id' => $validatedData['customer_id'],
        ]);

        return $project->toJson();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id) {
        $project = $this->projectRepository->findProjectById($id);

        return $project->toJson();
    }

    public function markAsCompleted(Project $project) {
        $project->is_completed = true;
        $project->update();

        return response()->json('Project updated!');
    }

}
