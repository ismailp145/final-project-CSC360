﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SocalAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddIsAvailableToPosts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsAvailable",
                table: "Posts",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsAvailable",
                table: "Posts");
        }
    }
}
