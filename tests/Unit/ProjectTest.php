<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Project;
use App\Repositories\ProjectRepository;
use Illuminate\Support\Collection;

class ProjectTest extends TestCase
{
      /** @test */
       public function it_can_show_all_the_projects()
       {
          $insertedproject = factory(Project::class)->create();
                      $projectRepo = new ProjectRepository(new Project);
                      $list = $projectRepo->listProjects()->toArray();
                      $myLastElement = end($list);
                     // $this->assertInstanceOf(Collection::class, $list);
                      $this->assertEquals($insertedproject->toArray(), $myLastElement);
       }

       /** @test */
       public function it_can_delete_the_project()
       {
           $project = factory(Project::class)->create();
           $projectRepo = new ProjectRepository($project);
           $deleted = $projectRepo->deleteProject($project->id);
           $this->assertTrue($deleted);
       }

       /** @test */
       public function it_can_update_the_project()
       {
           $project = factory(Project::class)->create();
           $title = 'unit-test';
           $data = ['title' => $title];
           $projectRepo = new ProjectRepository($project);
           $updated = $projectRepo->updateProject($data);
           $found = $projectRepo->findProjectById($project->id);
           $this->assertTrue($updated);
           $this->assertEquals($data['title'], $found->title);
       }

       /** @test */
       public function it_can_show_the_project()
       {
           $project = factory(Project::class)->create();
           $projectRepo = new ProjectRepository(new Project);
           $found = $projectRepo->findProjectById($project->id);
           $this->assertInstanceOf(Project::class, $found);
           $this->assertEquals($project->name, $found->name);
       }

       /** @test */
       public function it_can_create_a_project()
       {
           $data = [
               'title' => 'unit-test',
               'description' => 'test description',
               'created_by' => 'mike',
               'is_completed' => 0,
           ];

           $projectRepo = new ProjectRepository(new Project);
           $project = $projectRepo->createProject($data);
           $this->assertInstanceOf(Project::class, $project);
           $this->assertEquals($data['title'], $project->title);
       }

       /**
            * @codeCoverageIgnore
            */
       public function it_errors_creating_the_project_when_required_fields_are_not_passed()
       {
            $this->expectException(\Illuminate\Database\QueryException::class);
            $product = new ProjectRepository(new Project);
            $product->createProject([]);
       }

       /** @test */
           public function it_errors_finding_a_project()
           {
               $this->expectException(\Illuminate\Database\Eloquent\ModelNotFoundException::class);
               $category = new ProjectRepository(new Project);
               $category->findProjectById(999);
           }

            public function tearDown()
                                                                           {
                                                                               Project::where('title', 'unit-test')->delete();

                                                                               parent::tearDown();
                                                                           }
}
