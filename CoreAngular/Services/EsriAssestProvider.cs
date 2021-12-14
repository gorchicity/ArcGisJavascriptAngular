using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;

namespace CoreAngular.Services
{
    public class EsriAssetsProvider : IPostConfigureOptions<StaticFileOptions>
    {
        private readonly IWebHostEnvironment Environment;
        private readonly string AssetsPath;

        public EsriAssetsProvider(IWebHostEnvironment environment
            , IConfiguration config)
        {
            var configSection = config.GetSection("AppSettings");
            AssetsPath = configSection.GetValue<string>("EsriAssetsPath");
            this.Environment = environment;
        }

        public void PostConfigure(string name, StaticFileOptions options)
        {
            // Basic initialization in case the options weren't initialized by any other component
            options.ContentTypeProvider = options.ContentTypeProvider ?? new FileExtensionContentTypeProvider();

            if (options.FileProvider == null && this.Environment.WebRootFileProvider == null)
                throw new InvalidOperationException("Missing FileProvider.");

            options.FileProvider = options.FileProvider ?? this.Environment.WebRootFileProvider;

            // Add our provider
            List<IFileProvider> fileProviders = new List<IFileProvider>
            {
                options.FileProvider,
                new PhysicalFileProvider(AssetsPath)// @"E:\temp\esriAssetss")
            };

            options.FileProvider = new CompositeFileProvider(fileProviders);
        }
    }
}

