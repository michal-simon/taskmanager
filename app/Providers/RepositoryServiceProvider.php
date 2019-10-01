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
use App\Repositories\Interfaces\DepartmentRepositoryInterface;
use App\Repositories\DepartmentRepository;
use App\Repositories\Interfaces\InvoiceRepositoryInterface;
use App\Repositories\InvoiceRepository;
use App\Repositories\Interfaces\InvoiceLineRepositoryInterface;
use App\Repositories\InvoiceLineRepository;
use App\Repositories\Interfaces\CustomerRepositoryInterface;
use App\Repositories\CustomerRepository;
use App\Repositories\Interfaces\AddressRepositoryInterface;
use App\Repositories\AddressRepository;
use App\Repositories\Interfaces\EventRepositoryInterface;
use App\Repositories\EventRepository;
use App\Repositories\Interfaces\PermissionRepositoryInterface;
use App\Repositories\PermissionRepository;
use App\Repositories\Interfaces\MessageRepositoryInterface;
use App\Repositories\MessageRepository;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use App\Repositories\ProductRepository;
use App\Repositories\Interfaces\NotificationRepositoryInterface;
use App\Repositories\NotificationRepository;

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
                InvoiceRepositoryInterface::class, InvoiceRepository::class
        );

        $this->app->bind(
                InvoiceLineRepositoryInterface::class, InvoiceLineRepository::class
        );

        $this->app->bind(
                AddressRepositoryInterface::class, AddressRepository::class
        );

        $this->app->bind(
                RoleRepositoryInterface::class, RoleRepository::class
        );

        $this->app->bind(
                DepartmentRepositoryInterface::class, DepartmentRepository::class
        );

        $this->app->bind(
                EventRepositoryInterface::class, EventRepository::class
        );

        $this->app->bind(
                CustomerRepositoryInterface::class, CustomerRepository::class
        );

        $this->app->bind(
                PermissionRepositoryInterface::class, PermissionRepository::class
        );

        $this->app->bind(
                MessageRepositoryInterface::class, MessageRepository::class
        );

        $this->app->bind(
                ProductRepositoryInterface::class, ProductRepository::class
        );

        $this->app->bind(
                NotificationRepositoryInterface::class, NotificationRepository::class
        );
    }

}
