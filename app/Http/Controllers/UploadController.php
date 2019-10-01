<?php

namespace App\Http\Controllers;

use App\Requests\UploadRequest;
use App\Repositories\Interfaces\FileRepositoryInterface;
use App\Repositories\Interfaces\TaskRepositoryInterface;
use App\Repositories\UserRepository;
use App\Repositories\FileRepository;
use App\User;
use Illuminate\Support\Facades\Notification;
use App\Notifications\AttachmentCreated;

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
                $file_path = $file->store('uploads', ['disk' => 'public']);
                
                $file = $this->fileRepository->createFile([
                    'task_id' => $request->task_id,
                    'filename' => $filename,
                    'file_path' => $file_path,
                    'user_id' => $objUser->id
                ]);

                $arrAddedFiles[$count] = $file;
                $arrAddedFiles[$count]['user'] = $objUser->toArray();

            }
            
            //send notification
        $user = auth()->guard('user')->user();
        Notification::send($user, new AttachmentCreated($file));

            return collect($arrAddedFiles)->toJson();
        }
    }
    
    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     * @throws \Exception
     */
    public function destroy($id) {

        $file = $this->fileRepository->findFileById($id);
        $fileRepo = new FileRepository($file);
        $fileRepo->deleteFile();
        return response()->json('File deleted!');
    }
}
