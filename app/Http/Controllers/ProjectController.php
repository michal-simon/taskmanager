<?php

namespace App\Http\Controllers;

use App\Project;
use App\Repositories\Interfaces\ProjectRepositoryInterface;
use App\Repositories\ProjectRepository;
use App\Requests\CreateProjectRequest;
use App\Requests\UpdateProjectRequest;
use Illuminate\Support\Facades\Auth;

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
        $currentUser =  $user = Auth::user();

        $project = $this->projectRepository->create([
            'title' => $validatedData['title'],
            'description' => $validatedData['description'],
            'created_by' => $currentUser->id,
            'customer_id' => $validatedData['customer_id'],
        ]);

        return $project->toJson();
    }
    
     /**
     * @param UpdateProjectRequest $request
     * @param int $id
     *
     * @return Response
     */
    public function update(UpdateProjectRequest $request, int $id) {
        $project = $this->projectRepository->findProjectById($id);
        $projectRepo = new ProjectRepository($project);
        $projectRepo->updateProject($request->all());
        return response()->json('Updated project successfully');
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
