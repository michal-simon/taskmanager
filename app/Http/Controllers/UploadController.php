<?php

namespace App\Http\Controllers;

use App\Requests\UploadRequest;
use App\Repositories\Interfaces\FileRepositoryInterface;
use App\Repositories\Interfaces\TaskRepositoryInterface;
use App\Repositories\UserRepository;
use App\User;

class UploadController extends Controller
{

    private $fileRepository;
    private $taskRepository;

    public function __construct(FileRepositoryInterface $fileRepository, TaskRepositoryInterface $taskRepository)
    {
        $this->fileRepository = $fileRepository;
        $this->taskRepository = $taskRepository;
    }

    public function index($task_id) {

        $objTask = $this->taskRepository->findTaskById($task_id);

        $uploads = $this->fileRepository->getFilesForTask($objTask);

        return $uploads->toJson();
    }

    public function store(UploadRequest $request) {

        $objUser = (new UserRepository(new User))->findUserById($request->user_id);
        $arrAddedFiles = [];

        if($request->hasFile('file')) {
            foreach($request->file('file') as $count => $file)
            {
                $filename = $file->getClientOriginalName();
                $file->move(public_path().'/files/', $filename);  
                
                $file = $this->fileRepository->createFile([
                    'task_id' => $request->task_id,
                    'filename' => $filename,
                    'user_id' => $objUser->id
                ]);

                $arrAddedFiles[$count] = $file;
                $arrAddedFiles[$count]['user'] = $objUser->toArray();

            }

            return collect($arrAddedFiles)->toJson();
        }
    }
}
