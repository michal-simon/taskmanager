<?php

namespace Tests\Unit;

use App\Department;
use App\Repositories\DepartmentRepository;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use App\Transformations\DepartmentTransformable;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Collection;

class DepartmentUnitTest extends TestCase {

    use DatabaseTransactions,
        DepartmentTransformable,
        WithFaker;

    public function setUp(): void {
        parent::setUp();
        $this->beginDatabaseTransaction();
    }

    /** @test */
    public function it_can_transform_the_department() {
        $department = factory(Department::class)->create();
        $repo = new DepartmentRepository($department);
        $departmentFromDb = $repo->findDepartmentById($department->id);
        $cust = $this->transformDepartment($department);
        //$this->assertInternalType('string', $departmentFromDb->status);
        $this->assertInternalType('string', $cust->name);
    }

    /** @test */
    public function it_can_delete_a_department() {
        $department = factory(Department::class)->create();
        $departmentRepo = new DepartmentRepository($department);
        $delete = $departmentRepo->deleteDepartment();
        $this->assertTrue($delete);
        //$this->assertDatabaseHas('departments', $department->toArray());
    }

    /** @test */
    public function it_fails_when_the_department_is_not_found() {
        $this->expectException(\Illuminate\Database\Eloquent\ModelNotFoundException::class);
        $department = new DepartmentRepository(new Department);
        $department->findDepartmentById(999);
    }

    /** @test */
    public function it_can_find_a_department() {
        $data = [
            'first_name' => $this->faker->firstName,
            'email' => $this->faker->email,
        ];
        $department = new DepartmentRepository(new Department);
        $created = $department->createDepartment($data);
        $found = $department->findDepartmentById($created->id);
        $this->assertInstanceOf(Department::class, $found);
        $this->assertEquals($data['first_name'], $found->first_name);
        $this->assertEquals($data['email'], $found->email);
    }

    /** @test */
    public function it_can_update_the_department() {
        $cust = factory(Department::class)->create();
        $department = new DepartmentRepository($cust);
        $update = [
            'first_name' => $this->faker->firstName,
        ];
        $updated = $department->updateDepartment($update);
        $this->assertTrue($updated);
        $this->assertEquals($update['first_name'], $cust->first_name);
        $this->assertDatabaseHas('departments', $update);
    }

    /** @test */
    public function it_can_create_a_department() {
        $data = [
            'first_name' => $this->faker->firstName,
            'last_name' => $this->faker->lastName,
            'email' => $this->faker->email,
            'company_name' => $this->faker->company,
            'job_title' => $this->faker->jobTitle,
        ];
        $department = new DepartmentRepository(new Department);
        $created = $department->createDepartment($data);
        $this->assertInstanceOf(Department::class, $created);
        $this->assertEquals($data['first_name'], $created->first_name);
        $this->assertEquals($data['email'], $created->email);
        $collection = collect($data)->except('password');
        $this->assertDatabaseHas('departments', $collection->all());
    }

    public function it_errors_creating_the_department_when_required_fields_are_not_passed() {
        $this->expectException(\Illuminate\Database\QueryException::class);
        $task = new DepartmentRepository(new Department);
        $task->createDepartment([]);
    }

    /** @test */
    public function it_can_list_all_departments() {
        factory(Department::class, 5)->create();
        $departmentRepo = new DepartmentRepository(new Department);
        $list = $departmentRepo->listDepartments();
        $this->assertInstanceOf(Collection::class, $list);
    }

    public function tearDown(): void {
        parent::tearDown();
    }

}
