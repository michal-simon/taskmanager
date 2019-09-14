<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Interfaces\ProjectRepositoryInterface;
use App\Repositories\ProjectRepository;
use App\Repositories\Interfaces\TaskRepositoryInterface;
use App\Repositories\TaskRepository;
use App\Repositories\Interfaces\UserRepositoryInterface;
use App\Repositories\UserRepository;
use App\Repositories\Interfaces\TaskStatusRepositoryInterface;
use App\Repositories\TaskStatusRepository;
use App\Repositories\Interfaces\CommentRepositoryInterface;
use App\Repositories\CommentRepository;
use App\Repositories\Interfaces\FileRepositoryInterface;
use App\Repositories\FileRepository;
use App\Repositories\Interfaces\RoleRepositoryInterface;
use App\Repositories\RoleRepository;

class RepositoryServiceProvider extends ServiceProvider {

    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot() {
        //
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register() {
        $this->app->bind(
                ProjectRepositoryInterface::class, ProjectRepository::class
        );

        $this->app->bind(
                TaskRepositoryInterface::class, TaskRepository::class
        );

        $this->app->bind(
                TaskStatusRepositoryInterface::class, TaskStatusRepository::class
        );

        $this->app->bind(
                UserRepositoryInterface::class, UserRepository::class
        );

        $this->app->bind(
                CommentRepositoryInterface::class, CommentRepository::class
        );

        $this->app->bind(
                FileRepositoryInterface::class, FileRepository::class
        );

        $this->app->bind(
                RoleRepositoryInterface::class, RoleRepository::class
        );
    }

}
