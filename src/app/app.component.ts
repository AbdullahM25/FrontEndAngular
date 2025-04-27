import { NgFor } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { response } from 'express';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, NgFor, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private getPost = 'http://localhost:5000/posts';
  private readonly baseUrl = 'http://localhost:5000/posts';

  private http = inject(HttpClient);
  data: any[] = [];
  singleId: string = '';
  newTitle: string = '';
  newDescription: string = '';
  fetchId = '';
  deleteId = '';

  title = 'reddit-proj';

  ngOnInit(): void {
    this.getAllPosts();
  }
  getAllPosts() {
    this.http.get<any[]>(this.getPost).subscribe((response) => {
      this.data = response;
      console.log('data: ', this.data);
    });
  } //End of getallposts
  getSinglePost(): void {
    if (!this.fetchId.trim()) {
      this.getAllPosts();
      return;
    }

    this.http
      .get<any>(`${this.getPost}/${this.singleId}`)
      .subscribe((response) => {
        this.data = [response];
        console.log('single post:', this.data);
      });
  } // end of single id
  addNewPost(): void {
    const payload = {
      title: this.newTitle.trim(),
      description: this.newDescription.trim(),
    };
    if (!payload.title || !payload.description) {
      return;
    }

    this.http.post<any>(this.baseUrl, payload).subscribe((created) => {
      this.newTitle = '';
      this.newDescription = '';
      this.getAllPosts();
    });
  }
  deletePost(): void {
    if (!this.deleteId.trim()) {
      return;
    }

    this.http.delete<void>(`${this.baseUrl}/${this.singleId}`).subscribe(() => {
      console.log(`Deleted post ${this.singleId}`);
      this.singleId = '';
      this.getAllPosts();
    });
  }
}
