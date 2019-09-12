<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\File;
use App\Repositories\FileRepository;
use Illuminate\Support\Collection;

class FileTest extends TestCase
{
       /** @test */
        public function it_can_show_all_the_files()
        {
            $insertedfile = factory(File::class)->create();
                        $fileRepo = new FileRepository(new File);
                        $list = $fileRepo->listFiles()->toArray();
                        $myLastElement = end($list);
                       // $this->assertInstanceOf(Collection::class, $list);
                        $this->assertEquals($insertedfile->toArray(), $myLastElement);
        }

        /** @test */
        public function it_can_delete_the_file()
        {
            $file = factory(File::class)->create();
            $fileRepo = new FileRepository($file);
            $deleted = $fileRepo->deleteFile($file->id);
            $this->assertTrue($deleted);
        }

        /** @test */
        public function it_can_show_the_file()
        {
            $file = factory(File::class)->create();
            $fileRepo = new FileRepository(new File);
            $found = $fileRepo->findFileById($file->id);
            $this->assertInstanceOf(File::class, $found);
            $this->assertEquals($file->name, $found->name);
        }

        /** @test */
        public function it_can_create_a_file()
        {
            $data =  [
                'task_id' => 5,
                'user_id' => 1,
                'filename' => 'unittest.png',
            ];

            $fileRepo = new FileRepository(new File);
            $file = $fileRepo->createFile($data);
            $this->assertInstanceOf(File::class, $file);
            $this->assertEquals($data['filename'], $file->filename);
        }

        /**
             * @codeCoverageIgnore
             */
                       public function it_errors_creating_the_file_when_required_fields_are_not_passed()
                       {
                            $this->expectException(\Illuminate\Database\QueryException::class);
                            $product = new FileRepository(new File);
                            $product->createFile([]);
                       }

                        /** @test */
                                  public function it_errors_finding_a_file()
                                  {
                                      $this->expectException(\Illuminate\Database\Eloquent\ModelNotFoundException::class);
                                      $file = new FileRepository(new File);
                                      $file->findFileById(999);
                                  }

                                   public function tearDown()
                                      {
                                          File::where('filename', 'unittest.png')->delete();

                                          parent::tearDown();
                                      }
}
